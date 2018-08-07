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
    public class QueuesController : VengabusController
    {
        [HttpGet]
        [Route("queues")]
        public IEnumerable<VengaQueue> ListQueues()
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            return namespaceManager.GetQueues().Select(q => new VengaQueue(q, GetTimeStampOfMostRecentDeadletter(q.Path)));
        }

        [HttpGet]
        [Route("queues/{queueName}")]
        public VengaQueue GetDetails(string queueName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();


            return new VengaQueue(namespaceManager.GetQueue(queueName),GetTimeStampOfMostRecentDeadletter(queueName));
        }

        private DateTime? GetTimeStampOfMostRecentDeadletter(string queueName)
        {
            MessagingFactory factory = CreateEndpointFactory();
            var endpoint = EndpointIdentifier.ForQueue(queueName).GetDeadLetterEndpoint();
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint, factory);
            var mostRecent = deadLetterList.OrderByDescending(x => x.EnqueuedTimeUtc).FirstOrDefault();
            if (mostRecent != null)
            {
                return mostRecent.EnqueuedTimeUtc;
            }
            else
            {
                return null;
            }
        }
    }
}