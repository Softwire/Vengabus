using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{
    public class DeadLettersController : VengabusController
    {
        private string GetDeadLetterQueueName(string endpointName)
        {
            return endpointName + "/$DeadLetterQueue";
        }

        [HttpGet]
        [Route("queues/{queueName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInQueue(string queueName)
        {
            var endpoint = EndpointIdentifier.ForQueue(GetDeadLetterQueueName(queueName));
            return GetMessageFromEndpoint(endpoint);
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInSubscription(string topicName, string subscriptionName)
        {
            var endpoint = EndpointIdentifier.ForSubscription(topicName, GetDeadLetterQueueName(subscriptionName));
            return GetMessageFromEndpoint(endpoint);
        }

        private IEnumerable<VengaMessage> GetMessageFromEndpoint(EndpointIdentifier endpoint)
        {
            MessagingFactory factory = CreateEndpointFactory();
            var brokeredMessagesList = MessageServices.GetMessagesFromEndpoint(endpoint, factory);
            var messagesToReturn = new List<VengaMessage>();
            foreach (var message in brokeredMessagesList)
            {
                messagesToReturn.Add(VengaBrokeredMessageConverter.FromBrokeredMessage(message));
            }
            return messagesToReturn;
        }
    }
}

