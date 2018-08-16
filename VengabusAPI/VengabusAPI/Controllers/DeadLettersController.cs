using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Helpers;
using VengabusAPI.Models;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{
    public class DeadLettersController : VengabusController
    {
     
        [HttpGet]
        [Route("queues/{queueName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInQueue(string queueName)
        {
            return GetMessageFromEndpoint(new QueueDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName));
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInSubscription(string topicName, string subscriptionName)
        {
 
            return GetMessageFromEndpoint(new SubscriptionDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(),subscriptionName, topicName));
        }

        [HttpDelete]
        [Route("queues/{queueName}/deadletters/{uniqueId}")]
        public void DeleteSingleDeadLetterMessageInQueue(string queueName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(new QueueDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters/{uniqueId}")]
        public void DeleteSingleDeadLetterMessageInSubscription(string topicName, string subscriptionName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(new SubscriptionDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(),subscriptionName, topicName), messageId, uniqueId);
        }

        private IEnumerable<VengaMessage> GetMessageFromEndpoint(Endpoint endpoint)
        {
            var brokeredMessagesList = MessageServices.GetMessagesFromEndpoint(endpoint);
            var messagesToReturn = new List<VengaMessage>();
            foreach (var message in brokeredMessagesList)
            {
                messagesToReturn.Add(VengaMessage.FromBrokeredMessage(message));
            }
            return messagesToReturn;
        }
    }
}

