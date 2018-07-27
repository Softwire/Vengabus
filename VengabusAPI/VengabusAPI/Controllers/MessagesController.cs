using System;
using System.Collections.Generic;
using System.Web.Http;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{
    public class MessageInfoPost
    {
        public Dictionary<string, object> MessageProperties { get; set; }
        public string MessageBody { get; set; }
        public string MessageId { get; set; }
        public string ContentType { get; set; }
    }


    public class MessagesController : VengabusController
    {

        [HttpPost]
        [Route("messages/send/queue/{queueName}")]
        public void SendMessageToQueue(string queueName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(queueName, EndpointType.Queue, messageInfoObject);
        }

        [HttpPost]
        [Route("messages/send/topic/{topicName}")]
        public void SendMessageToTopic(string topicName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(topicName, EndpointType.Topic, messageInfoObject);
        }

        [HttpPost]
        [Route("messages/send/subscription/{topicName}/{subscriptionName}")]
        public void SendMessageToSubscription(string topicName, string subscriptionName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(subscriptionName, EndpointType.Topic, messageInfoObject, topicName);
        }

        [HttpGet]
        [Route("messages/list/queue/{queueName}")]
        //list the messages in a given queue
        public void ListMessagesInQueue(string queueName)
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("messages/list/subscription/{topicName}/{subscriptionName}")]
        //list the messages in a given subscription
        public void ListMessagesInSubscription(string topicName, string subscriptionName)
        {
            throw new NotImplementedException();
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
            var factory = CreateEndpointSenderFactory();
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
        private void SendMessageToEndpoint(string endpointName, EndpointType type, MessageInfoPost messageInfoObject, string parentTopicName = "")
        {
            //Sending message to queue. 
            var brokeredMessage = CreateAzureBrokeredMessage(messageInfoObject);
            var factory = CreateEndpointSenderFactory();

            SendMessageToEndpoint(endpointName, type, factory, brokeredMessage, parentTopicName);
        }
        private void SendMessageToEndpoint(string endpointName, EndpointType type, MessagingFactory clientFactory, BrokeredMessage message, string parentTopicName = "")
        {
            switch (type)
            {
                case EndpointType.Queue:
                    QueueClient queueClient = clientFactory.CreateQueueClient(endpointName);
                    queueClient.Send(message);
                    return;

                case EndpointType.Topic:
                    TopicClient topicClient = clientFactory.CreateTopicClient(endpointName);
                    topicClient.Send(message);
                    return;

                case EndpointType.Subscription:
                    throw new NotImplementedException();
            }
        }
        private BrokeredMessage CreateAzureBrokeredMessage(MessageInfoPost messageInfoObject)
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