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
            DeleteMessagesFromEndpoint(EndpointIdentifier.ForQueue(queueName));
        }

        [HttpDelete]
        [Route("queues/{queueName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInQueue(string queueName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(EndpointIdentifier.ForQueue(queueName), EndpointType.Message, messageId, uniqueId);
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        //delete all messages in a given subscription
        public void PurgeSubscriptionMessages(string topicName, string subscriptionName)
        {
            DeleteMessagesFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName));
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInSubscription(string topicName, string subscriptionName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(
                EndpointIdentifier.ForSubscription(topicName, subscriptionName), EndpointType.Message, messageId, uniqueId);
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
                DeleteMessagesFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionDescription.Name));
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
                DeleteSingleMessageFromEndpoint(
                    EndpointIdentifier.ForSubscription(topicName, subscriptionDescription.Name), EndpointType.Message, messageId, uniqueId);
            }
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

        private void DeleteMessagesFromEndpoint(EndpointIdentifier endpoint)
        {
            DeleteMessageFromEndpoint(endpoint, EndpointType.Message);
        }

    }
}