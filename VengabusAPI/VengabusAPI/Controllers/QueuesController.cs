using System;
using System.Collections;
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

            var queues = namespaceManager.GetQueues().Select(q => new VengaQueue(q));
            return queues.OrderBy(q => q.name, StringComparer.CurrentCultureIgnoreCase);


        }

        [HttpGet]
        [Route("queues/{queueName}")]
        public VengaQueue GetDetails(string queueName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            return new VengaQueue(namespaceManager.GetQueue(queueName));
        }

        [HttpGet]
        [Route("queues/{queueName}/mostRecentDeadletter")]
        public DateTime? GetTimeStampOfMostRecentDeadletter(string queueName)
        [HttpPost]
        [Route("queues/update")]
        public void UpdateQueue([FromBody]VengaQueue vengaQueue)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            QueueDescription description = ConvertVengaQueueToQueueDescription(vengaQueue);

            namespaceManager.UpdateQueue(description);
        }

        private QueueDescription ConvertVengaQueueToQueueDescription(VengaQueue vengaQueue)
        {
            var description = new QueueDescription(vengaQueue.name)
            {
                SupportOrdering = vengaQueue.supportOrdering
            };

            return description;
        }

        private DateTime? GetTimeStampOfMostRecentDeadletter(string queueName)
        {
            var endpoint = new QueueDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName);
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint);
            var mostRecent = deadLetterList.OrderByDescending(x => x.EnqueuedTimeUtc).FirstOrDefault();
            return mostRecent?.EnqueuedTimeUtc;
        }
    }
}