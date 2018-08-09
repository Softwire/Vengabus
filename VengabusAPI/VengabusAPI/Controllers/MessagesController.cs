using System;
using System.Collections.Generic;
using System.Web.Http;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Helpers;
using VengabusAPI.Models;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{
    public class MessagesController : VengabusController
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
            SendMessageToEndpoint(EndpointIdentifier.ForQueue(queueName), message);
        }

        [HttpPost]
        [Route("topics/{topicName}/messages")]
        public void SendMessageToTopic(string topicName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForTopic(topicName), message);
        }

        [HttpPost]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        public void SendMessageToSubscription(string topicName, string subscriptionName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName), message);
        }

        [HttpGet]
        [Route("queues/{queueName}/messages")]
        //list the messages in a given queue
        public IEnumerable<VengaMessage> ListMessagesInQueue(string queueName)
        {
            return GetMessagesFromEndpoint(EndpointIdentifier.ForQueue(queueName));
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        //list the messages in a given subscription
        public IEnumerable<VengaMessage> ListMessagesInSubscription(string topicName, string subscriptionName)
        {
            return GetMessagesFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName));
        }

        //delete all messages in a given queue
        [HttpDelete]
        [Route("queues/{queueName}/messages")]
        public void PurgeQueueMessages(string queueName)
        {
            DeleteMessageFromEndpoint(EndpointIdentifier.ForQueue(queueName));
        }

        [HttpDelete]
        [Route("queues/{queueName}/message/{uniqueId}")]
        public void DeleteSingleMessageInQueue(string queueName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(EndpointIdentifier.ForQueue(queueName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        //delete all messages in a given subscription
        public void PurgeSubscriptionMessages(string topicName, string subscriptionName)
        {
            DeleteMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName));
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/message/{uniqueId}")]
        //delete all messages in a given subscription
        public void DeleteSingleMessageInSubscription(string topicName, string subscriptionName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(
                EndpointIdentifier.ForSubscription(topicName, subscriptionName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("topics/{topicName}/messages")]
        //delete all messages in all the subscriptions for a given topic
        public void PurgeTopicMessages(string topicName)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                DeleteMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionDescription.Name));
            }
        }

        [HttpDelete]
        [Route("topics/{topicName}/message/{uniqueId}")]
        //delete all messages in all the subscriptions for a given topic
        public void DeleteSingleMessageInTopic(string topicName, string uniqueId, [FromUri]string messageId)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                DeleteSingleMessageFromEndpoint(
                    EndpointIdentifier.ForSubscription(topicName, subscriptionDescription.Name), messageId, uniqueId);
            }
        }

        private void DeleteMessageFromEndpoint(EndpointIdentifier endpoint)
        {
            var factory = CreateEndpointFactory();
            var namespaceManager = CreateNamespaceManager();
            MessageServices.DeleteMessageFromEndpoint(factory, namespaceManager, endpoint);
        }

        private void DeleteSingleMessageFromEndpoint(EndpointIdentifier endpoint, string messageId, string uniqueId)
        {
            var factory = CreateEndpointFactory();
            var namespaceManager = CreateNamespaceManager();
            MessageServices.DeleteSingleMessageFromEndpoint(factory, namespaceManager, endpoint, messageId, uniqueId);
        }
        

        private void SendMessageToEndpoint(EndpointIdentifier endpoint, VengaMessage message)
        {
            //Sending message to queue. 
            var brokeredMessage = message.ToBrokeredMessage();
            var factory = CreateEndpointFactory();
            MessageServices.SendMessageToEndpoint(endpoint, factory, brokeredMessage);
        }

        private IEnumerable<VengaMessage> GetMessagesFromEndpoint(EndpointIdentifier endpoint)
        {
            MessagingFactory factory = CreateEndpointFactory();
            var brokeredMessagesList = MessageServices.GetMessagesFromEndpoint(endpoint, factory);
            var messagesToReturn = new List<VengaMessage>();
            foreach (var message in brokeredMessagesList)
            {
                messagesToReturn.Add(VengaMessage.FromBrokeredMessage(message));
            }
            return messagesToReturn;
        }

    }
}