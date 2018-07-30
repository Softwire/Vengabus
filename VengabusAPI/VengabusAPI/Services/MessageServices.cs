using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;
using VengabusAPI.Controllers;

namespace VengabusAPI.Services
{
    
    public class MessageServices
    {
        public static IEnumerable<VengaMessage> GetMessageFromEndpoint(EndpointIdentifier endpoint, MessagingFactory clientFactory)
        {
            //call the PeekBatch method of corresponding client with the provided parameters.
            Func<long, int, IEnumerable<BrokeredMessage>> peekNextBatch;

            switch (endpoint.Type)
            {
                case EndpointType.Queue:
                    QueueClient queueClient = clientFactory.CreateQueueClient(endpoint.Name);
                    peekNextBatch = (peekStartingPoint, number) => { return queueClient.PeekBatch(peekStartingPoint, number); };
                    break;
                case EndpointType.Subscription:
                    SubscriptionClient subscriptionClient =
                        clientFactory.CreateSubscriptionClient(endpoint.ParentTopic, endpoint.Name);
                    peekNextBatch = (peekStartingPoint, number) => { return subscriptionClient.PeekBatch(peekStartingPoint, number); };
                    break;
                default:
                    peekNextBatch = (peekStartingPoint, number) => { return Enumerable.Empty<BrokeredMessage>(); };
                    break;
            }

            var messagesToReturn = new List<VengaMessage>();

            /*
             * The problem here is that, QueueClient.Peekbatch(number) does not guarantee to return the specified number
             * of messages. Instead, the given number is just an upper bound. We have to record the Sequence Number
             * of the last received message from the previous call of Peekbatch(), and call it again starting from 
             * the previous Sequence Message + 1 in order to read new messages, until there are no messages left.
             * */
            //use -1 instead of 0, in case there's a message with sequence number 0
            long lastSequenceNumber = -1;

            //we are not realistically getting that many matches in one PeekBatch anyway -- this should be enough for this project
            int maxMessagesInPeekBatch = 100;

            while (true)
            {
                //one after the last message we've looked at
                var messages = peekNextBatch(lastSequenceNumber + 1, maxMessagesInPeekBatch).ToList();
                if (!messages.Any())
                {
                    break;
                }

                foreach (var message in messages)
                {
                    //optimally, VengaMessage should have a constructor that takes BrokeredMessage. But it's probably better to do this when restructuring VengaMessage.
                    var vengaMessage = new VengaMessage(message.Properties, message.GetBody<String>(),
                        message.MessageId, message.ContentType);
                    messagesToReturn.Add(vengaMessage);
                    lastSequenceNumber = Math.Max(lastSequenceNumber, message.SequenceNumber);
                }
            }

            return messagesToReturn;
        }

        public void SendMessageToSingleSubscription(EndpointIdentifier endpoint, MessagingFactory clientFactory, BrokeredMessage message, NamespaceManager namespaceManager)
        {
            var azureSubscriptionsEnum = namespaceManager.GetSubscriptions(endpoint.ParentTopic);
            IEnumerable<VengaSubscription> azureSubscriptions = azureSubscriptionsEnum.Select(s => new VengaSubscription(s));
            Dictionary<SubscriptionClient, IEnumerable<RuleDescription>> dict = new Dictionary<SubscriptionClient, IEnumerable<RuleDescription>>();


            foreach (var azureSubscription in azureSubscriptions)
            {
                if (azureSubscription.name == endpoint.Name)
                    continue;

                SubscriptionClient subscriptionClient =
                    clientFactory.CreateSubscriptionClient(endpoint.ParentTopic, azureSubscription.name);
                IEnumerable<RuleDescription> subscriptionsRules =
                namespaceManager.GetRules(endpoint.ParentTopic, azureSubscription.name);
                dict.Add(subscriptionClient, subscriptionsRules);

                foreach (var subscriptionRule in subscriptionsRules)
                {
                    subscriptionClient.RemoveRule(subscriptionRule.Name);
                }

            }

            EndpointIdentifier newEndpointIdentifier = EndpointIdentifier.ForTopic(endpoint.ParentTopic);

            SendMessageToEndpoint(newEndpointIdentifier, clientFactory, message);

            foreach (KeyValuePair<SubscriptionClient, IEnumerable<RuleDescription>> entry in dict)
            {
                SubscriptionClient subscriptionClient = entry.Key;
                IEnumerable<RuleDescription> subscriptionsRules = entry.Value;
                foreach (var subscriptionRule in subscriptionsRules)
                {
                    subscriptionClient.AddRule(subscriptionRule);
                }
            }

            return;

        }

        public static void SendMessageToEndpoint(EndpointIdentifier endpoint, MessagingFactory clientFactory, BrokeredMessage message)
        {
            switch (endpoint.Type)
            {
                case EndpointType.Queue:
                    QueueClient queueClient = clientFactory.CreateQueueClient(endpoint.Name);
                    queueClient.Send(message);
                    return;

                case EndpointType.Topic:
                    TopicClient topicClient = clientFactory.CreateTopicClient(endpoint.Name);
                    topicClient.Send(message);
                    return;

                case EndpointType.Subscription:
                    throw new NotImplementedException("Feature deprecated due to issues with implementation.");
            }
        }

        public static void DeleteMessageFromEndpoint(MessagingFactory clientFactory, NamespaceManager namespaceManager, EndpointIdentifier endpoint)
        {
            long remainingMessagesToDelete = 0;
            Func<long, BrokeredMessage> receiveNextMessage;
            Func<long> getMessageCount;
            long defaultTimeout = 200;

            switch (endpoint.Type)
            {
                case EndpointType.Queue:
                    QueueClient queueClient = clientFactory.CreateQueueClient(endpoint.Name);
                    receiveNextMessage = (timeout) => queueClient.Receive(TimeSpan.FromMilliseconds(timeout));
                    getMessageCount = () =>
                        namespaceManager.GetQueue(endpoint.Name).MessageCountDetails.ActiveMessageCount;
                    break;
                case EndpointType.Subscription:
                    SubscriptionClient subscriptionClient =
                        clientFactory.CreateSubscriptionClient(endpoint.ParentTopic, endpoint.Name);
                    receiveNextMessage = (timeout) => subscriptionClient.Receive(TimeSpan.FromMilliseconds(timeout));
                    getMessageCount = () => namespaceManager.GetSubscription(endpoint.ParentTopic, endpoint.Name)
                        .MessageCountDetails.ActiveMessageCount;
                    break;
                default:
                    receiveNextMessage = (timeout) => null;
                    getMessageCount = () => 0;
                    break;
            }

            remainingMessagesToDelete = getMessageCount();

            Func<BrokeredMessage> getNextMessageWithRetries = () => {
                long multiplier = 1;
                while (multiplier * defaultTimeout <= 60 * 1000)
                {
                    BrokeredMessage message = receiveNextMessage(defaultTimeout * multiplier);
                    if (message != null || getMessageCount() == 0)
                    {
                        return message;
                    }
                    multiplier *= 2;
                }

                throw new TimeoutException(
                    "Messages are still present in endpoint, but it's taking too long to fetch them. Process aborted."
                );
            };

            //a rigorous way to make sure that we only delete the messages that shall be deleted, and we don't hang forever
            DateTime dateTimeCutoff = DateTime.Now;
            while (remainingMessagesToDelete > 0)
            {
                BrokeredMessage message = getNextMessageWithRetries();
                if (message == null || message.EnqueuedTimeUtc > dateTimeCutoff)
                {
                    break;
                }
                message.Complete();
                remainingMessagesToDelete--;
            }
        }
    }
}
 