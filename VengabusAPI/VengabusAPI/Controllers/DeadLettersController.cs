﻿using System;
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
     
        [HttpGet]
        [Route("queues/{queueName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInQueue(string queueName)
        {
            var endpoint = EndpointIdentifier.ForQueue(queueName).GetDeadLetterEndpoint(); 
            return GetMessageFromEndpoint(endpoint);
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInSubscription(string topicName, string subscriptionName)
        {
            var endpoint = EndpointIdentifier.ForSubscription(topicName, subscriptionName).GetDeadLetterEndpoint();
            return GetMessageFromEndpoint(endpoint);
        }

        [HttpDelete]
        [Route("queues/{queueName}/deadletter/{uniqueId}")]
        public void DeleteSingleDeadLetterMessageInQueue(string queueName, string uniqueId, [FromUri]string messageId)
        {
            var endpoint = EndpointIdentifier.ForQueue(queueName).GetDeadLetterEndpoint();
            DeleteSingleMessageFromEndpoint(endpoint, messageId, uniqueId);
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletter/{uniqueId}")]
        public void DeleteSingleDeadLetterMessageInSubscription(string topicName, string subscriptionName, string uniqueId, [FromUri]string messageId)
        {
            var endpoint = EndpointIdentifier.ForSubscription(topicName, subscriptionName).GetDeadLetterEndpoint();
            DeleteSingleMessageFromEndpoint(endpoint, messageId, uniqueId);
        }

        private IEnumerable<VengaMessage> GetMessageFromEndpoint(EndpointIdentifier endpoint)
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

