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
        [Route("deadletters/list/queue/{queueName}")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInQueue(string queueName)
        {
            return GetMessageFromEndpoint(EndpointIdentifier.ForQueue(GetDeadLetterQueueName(queueName)));
        }

        [HttpGet]
        [Route("deadletters/list/subscription/{topicName}/{subscriptionName}")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInSubscription(string topicName, string subscriptionName)
        {
            return GetMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, GetDeadLetterQueueName(subscriptionName)));
        }

        private IEnumerable<VengaMessage> GetMessageFromEndpoint(EndpointIdentifier endpoint)
        {
            MessagingFactory factory = CreateEndpointFactory();
            return MessageServices.GetMessageFromEndpoint(endpoint, factory);
        }
    }
}

