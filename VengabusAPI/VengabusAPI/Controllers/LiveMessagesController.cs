using System;
using System.Collections.Generic;
using System.Web.Http;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Helpers;
using VengabusAPI.Models;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{
    public class LiveMessagesController : MessagesController
    {

        [HttpGet]
        [Route("messages/properties/readable")]
        public IEnumerable<string> GetReadableProperties()
        {
            return MessageProperties.SupportedGetProperties;
        }

        [HttpGet]
        [Route("messages/properties/writeable")]
        public IEnumerable<string> GetWriteableProperties()
        {
            return MessageProperties.SupportedSetProperties;
        }

        [HttpPost]
        [Route("queues/{queueName}/messages")]
        public void SendMessageToQueue(string queueName, [FromBody]VengaMessage message)
        {

            SendMessageToEndpoint(new QueueEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName), message);
        }

        [HttpPost]
        [Route("topics/{topicName}/messages")]
        public void SendMessageToTopic(string topicName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(new TopicEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), topicName), message);
        }

        [HttpPost]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        public void SendMessageToSubscription(string topicName, string subscriptionName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(new TopicEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), topicName), message);
        }

        [HttpGet]
        [Route("queues/{queueName}/messages")]
        //list the messages in a given queue
        public IEnumerable<VengaMessage> ListMessagesInQueue(string queueName)
        {
            return GetMessagesFromEndpoint(new QueueEndpoint(CreateNamespaceManager(),CreateEndpointFactory(), queueName));
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        //list the messages in a given subscription
        public IEnumerable<VengaMessage> ListMessagesInSubscription(string topicName, string subscriptionName)
        {
            return GetMessagesFromEndpoint(new SubscriptionEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), subscriptionName, topicName));
        }

        //delete all messages in a given queue
        [HttpDelete]
        [Route("queues/{queueName}/messages")]
        public void DeleteAllMessagesInQueue(string queueName)
        {
            PurgeMessagesFromEndpoint(new QueueEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName));
        }

        [HttpDelete]
        [Route("queues/{queueName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInQueue(string queueName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(new QueueEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        //delete all messages in a given subscription
        public void DeleteAllMessagesInSubscription(string topicName, string subscriptionName)
        {
            PurgeMessagesFromEndpoint(new SubscriptionEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), subscriptionName, topicName));
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInSubscription(string topicName, string subscriptionName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(new SubscriptionEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), subscriptionName, topicName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("topics/{topicName}/messages")]
        //delete all messages in all the subscriptions for a given topic
        public void DeleteAllMessagesInTopic(string topicName)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                PurgeMessagesFromEndpoint(new SubscriptionEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), subscriptionDescription.Name, topicName));
            }
        }

        [HttpDelete]
        [Route("topics/{topicName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInTopic(string topicName, string uniqueId, [FromUri]string messageId)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                DeleteSingleMessageFromEndpoint(new SubscriptionEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), subscriptionDescription.Name, topicName), messageId, uniqueId);
            }
        }

        private void SendMessageToEndpoint(Endpoint endpoint, VengaMessage message)
        {
            var brokeredMessage = message.ToBrokeredMessage();
            MessageServices.SendMessageToEndpoint(endpoint, brokeredMessage);
        }
    }
}