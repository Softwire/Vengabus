using System;
using System.Collections.Generic;
using System.Web.Http;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{
    public class MessagesController : VengabusController
    {

        [HttpGet]
        [Route("message/properties/gettable")]
        public IEnumerable<string> GetGettableProperties()
        {
            return MessageProperties.SupportedGetProperties;
        }

        [HttpGet]
        [Route("message/properties/settable")]
        public IEnumerable<string> GetSettableProperties()
        {
            return MessageProperties.SupportedSetProperties;
        }

        [HttpPost]
        [Route("messages/send/queue/{queueName}")]
        public void SendMessageToQueue(string queueName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForQueue(queueName), message);
        }

        [HttpPost]
        [Route("messages/send/topic/{topicName}")]
        public void SendMessageToTopic(string topicName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForTopic(topicName), message);
        }

        [HttpPost]
        [Route("messages/send/subscription/{topicName}/{subscriptionName}")]
        public void SendMessageToSubscription(string topicName, string subscriptionName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName), message);
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
            var namespaceManager = CreateNamespaceManager();
            MessageServices.DeleteMessageFromEndpoint(factory, namespaceManager, endpoint);
        }
        

        private void SendMessageToEndpoint(EndpointIdentifier endpoint, VengaMessage message)
        {
            //Sending message to queue. 
            var brokeredMessage = message.ToBrokeredMessage();
            var factory = CreateEndpointFactory();
            MessageServices.SendMessageToEndpoint(endpoint, factory, brokeredMessage);
        }

        private IEnumerable<VengaMessage> GetMessageFromEndpoint(EndpointIdentifier endpoint)
        {
            MessagingFactory factory = CreateEndpointFactory();
            return MessageServices.GetMessageFromEndpoint(endpoint, factory);
        }

    }
}