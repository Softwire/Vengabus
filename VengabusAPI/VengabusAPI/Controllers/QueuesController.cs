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

            return namespaceManager.GetQueues().Select(q => new VengaQueue(q, getTimeStampOfMostRecentDeadletter(q.Path)));
        }

        [HttpGet]
        [Route("queues/{queueName}")]
        public VengaQueue GetDetails(string queueName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();


            return new VengaQueue(namespaceManager.GetQueue(queueName),getTimeStampOfMostRecentDeadletter(queueName));
        }

        public DateTime getTimeStampOfMostRecentDeadletter(string queueName) {
            MessagingFactory factory = CreateEndpointFactory();
            var endpoint = EndpointIdentifier.ForQueue(queueName + "/$DeadLetterQueue");
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint, factory);
            var mostRecent = deadLetterList.OrderBy(x => x.EnqueuedTimeUtc).FirstOrDefault();
            if (mostRecent != null)
            {
                return mostRecent.EnqueuedTimeUtc;
            }
            else {
                return new DateTime(1999, 3, 24);
            }
        }
    }
}