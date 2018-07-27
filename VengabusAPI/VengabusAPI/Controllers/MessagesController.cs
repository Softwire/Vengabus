using System;
using System.Collections.Generic;
using System.Web.Http;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;
using System.Linq;

namespace VengabusAPI.Controllers
{
    public class MessagesController : VengabusController
    {

        [HttpPost]
        [Route("messages/send/queue/{queueName}")]
        public void SendMessageToQueue(string queueName, [FromBody]VengaMessage messageInfoObject)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForQueue(queueName), messageInfoObject);
        }

        [HttpPost]
        [Route("messages/send/topic/{topicName}")]
        public void SendMessageToTopic(string topicName, [FromBody]VengaMessage messageInfoObject)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForTopic(topicName), messageInfoObject);
        }

        [HttpPost]
        [Route("messages/send/subscription/{topicName}/{subscriptionName}")]
        public void SendMessageToSubscription(string topicName, string subscriptionName, [FromBody]VengaMessage messageInfoObject)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName), messageInfoObject);
        }

        [HttpGet]
        [Route("messages/list/queue/{queueName}")]
        //list the messages in a given queue
        public IEnumerable<VengaMessage> ListMessagesInQueue(string queueName)
        {
            return GetMessageFromEndpoint(EndpointIdentifier.ForQueue(queueName));
        }

        [HttpGet]
        [Route("messages/list/subscription/{topicName}/{subscriptionName}")]
        //list the messages in a given subscription
        public IEnumerable<VengaMessage> ListMessagesInSubscription(string topicName, string subscriptionName)
        {
            return GetMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName));
        }

        [HttpGet]
        [Route("messages/listDeadLetters/queue/{queueName}")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInQueue(string queueName)
        {
            return GetMessageFromEndpoint(EndpointIdentifier.ForQueue(queueName + "/$DeadLetterQueue"));
        }

        [HttpGet]
        [Route("messages/listDeadLetters/subscription/{topicName}/{subscriptionName}")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInSubscription(string topicName, string subscriptionName)
        {
            return GetMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName + "/$DeadLetterQueue"));
        }

        //delete all messages in a given queue
        [HttpDelete]
        [Route("messages/queue/{queueName}")]
        public void DeleteAllMessagesInQueue(string queueName)
        {
            DeleteMessageFromEndpoint(EndpointIdentifier.ForQueue(queueName));
        }

        [HttpDelete]
        [Route("messages/subscription/{topicName}/{subscriptionName}")]
        //delete all messages in a given subscription
        public void DeleteAllMessagesInSubscription(string topicName, string subscriptionName)
        {
            DeleteMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName));
        }

        [HttpDelete]
        [Route("messages/topic/{topicName}")]
        //delete all messages in all the subscriptions for a given topic
        public void DeleteAllMessagesInTopic(string topicName)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                DeleteMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionDescription.Name));
            }
        }

        private void DeleteMessageFromEndpoint(EndpointIdentifier endpoint)
        {
            var factory = CreateEndpointFactory();
            DeleteMessageFromEndpoint(factory, endpoint);
        }

        private void DeleteMessageFromEndpoint(MessagingFactory clientFactory, EndpointIdentifier endpoint)
        {
            long remainingMessagesToDelete = 0;
            var namespaceManager = CreateNamespaceManager();
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
                while (multiplier*defaultTimeout <= 60 * 1000)
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

        private void SendMessageToEndpoint(EndpointIdentifier endpoint, VengaMessage messageInfoObject)
        {
            //Sending message to queue. 
            var brokeredMessage = CreateAzureBrokeredMessage(messageInfoObject);
            var factory = CreateEndpointFactory();

            SendMessageToEndpoint(endpoint, factory, brokeredMessage);
        }

        private void SendMessageToEndpoint(EndpointIdentifier endpoint, MessagingFactory clientFactory, BrokeredMessage message)
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
                    throw new NotImplementedException();
            }
        }

        private IEnumerable<VengaMessage> GetMessageFromEndpoint(EndpointIdentifier endpoint)
        {
            var clientFactory = CreateEndpointFactory();

            Func<int, long, IEnumerable<BrokeredMessage>> peekNextBatch;

            switch (endpoint.Type)
            {
                case EndpointType.Queue:
                    QueueClient queueClient = clientFactory.CreateQueueClient(endpoint.Name);
                    peekNextBatch = (number, peekStartingPoint) => { return queueClient.PeekBatch(peekStartingPoint, number); };
                    break;
                case EndpointType.Subscription:
                    SubscriptionClient subscriptionClient =
                        clientFactory.CreateSubscriptionClient(endpoint.ParentTopic, endpoint.Name);
                    peekNextBatch = (number, peekStartingPoint) => { return subscriptionClient.PeekBatch(peekStartingPoint, number); };
                    break;
                default:
                    peekNextBatch = (number, peekStartingPoint) => { return Enumerable.Empty<BrokeredMessage>(); };
                    break;
            }

            IEnumerable<VengaMessage> messageOutputIEnum = Enumerable.Empty<VengaMessage>();

            /*
             * The problem here is that, QueueClient.Peekbatch(number) does not guarantee to return the specified number
             * of messages. Instead, the given number is just an upper bound. We have to record the Sequence Number
             * of the last received message from the previous call of Peekbatch(), and call it again starting from 
             * the previous Sequence Message + 1 in order to read new messages, until there are no messages left.
             * */
            long lastSequenceNumber = 0;

            //we are not realistically getting that many matches in one PeekBatch anyway -- this should be enough for this project
            int maxMessagesInPeekBatch = 100;

            while (true)
            {
                var messages = peekNextBatch(maxMessagesInPeekBatch, lastSequenceNumber);
                if (!messages.Any())
                {
                    break;
                }

                foreach (var message in messages)
                {
                    var vengaMessage = new VengaMessage(message.Properties, message.GetBody<String>(),
                        message.MessageId, message.ContentType);
                    messageOutputIEnum = messageOutputIEnum.Concat(new[] { vengaMessage });
                    lastSequenceNumber = message.SequenceNumber + 1;
                }
            }

            return messageOutputIEnum;
        }

        private BrokeredMessage CreateAzureBrokeredMessage(VengaMessage messageInfoObject)
        {
            var message = new BrokeredMessage(messageInfoObject.MessageBody);
            message.MessageId = messageInfoObject.MessageId;
            message.ContentType = messageInfoObject.ContentType;

            foreach (var property in messageInfoObject.MessageProperties)
            {
                message.Properties.Add(property.Key, property.Value);
            }

            return message;
        }

    }
}