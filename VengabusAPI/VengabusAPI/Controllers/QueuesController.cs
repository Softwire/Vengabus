using System;
using System.Collections;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Reflection;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using Newtonsoft.Json;
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
        public void UpdateQueue([FromBody]VengaQueueUpload queueData)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            QueueDescription description = namespaceManager.GetQueue(queueData.name);
            description = UpdateDescription(description, queueData);

            namespaceManager.UpdateQueue(description);
        }

        [HttpPost]
        [Route("queues/rename")]
        public void RenameQueue([FromBody]Rename names)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            namespaceManager.RenameQueue(names.oldName, names.newName);
        }

        public QueueDescription UpdateDescription(QueueDescription description, VengaQueueUpload queueData)
        {
            description.SupportOrdering = queueData.supportOrdering;
            description.RequiresSession = queueData.requiresSession;
            description.EnablePartitioning = queueData.enablePartitioning;
            description.AutoDeleteOnIdle = queueData.autoDeleteOnIdle.AsTimeSpan();

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