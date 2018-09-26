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
        public IEnumerable<QueueSummary> ListQueues()
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            var queues = namespaceManager.GetQueues().Select(q => QueueSummary.New(q));
            return queues.OrderBy(q => q.name, StringComparer.CurrentCultureIgnoreCase);
        }

        [HttpGet]
        [Route("queues/{queueName}")]
        public QueueDetails GetDetails(string queueName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            return QueueDetails.New(namespaceManager.GetQueue(queueName));
        }

        [HttpGet]
        [Route("queues/{queueName}/mostRecentDeadletter")]
        public DateTime? GetTimeStampOfMostRecentDeadletter(string queueName)
        {
            var endpoint = new QueueDeadletterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName);
            var deadletterList = MessageServices.GetMessagesFromEndpoint(endpoint);
            var mostRecent = deadletterList.OrderByDescending(x => x.EnqueuedTimeUtc).FirstOrDefault();
            return mostRecent?.EnqueuedTimeUtc;
        }

        [HttpPost]
        [Route("queues/update")]
        public void UpdateQueue([FromBody]QueueDetails queueData)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            QueueDescription description = namespaceManager.GetQueue(queueData.name);
            queueData.ApplyChangesToDescription(description);

            namespaceManager.UpdateQueue(description);
        }

        [HttpPost]
        [Route("queues/rename")]
        public void RenameQueue([FromBody]Rename names)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            QueueDescription description = namespaceManager.GetQueue(names.oldName);
            if (description.EnablePartitioning)
            {
                throw new Exception("Partitioned queues cannot be renamed.");
            }
            namespaceManager.RenameQueue(names.oldName, names.newName);
        }

        [HttpDelete]
        [Route("queues/delete/{queueName}")]
        public void DeleteQueue(string queueName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            namespaceManager.DeleteQueue(queueName);
        }
    }
}