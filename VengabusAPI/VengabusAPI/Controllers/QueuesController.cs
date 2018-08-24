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
        {
            var endpoint = new QueueDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName);
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint);
            var mostRecent = deadLetterList.OrderByDescending(x => x.EnqueuedTimeUtc).FirstOrDefault();
            return mostRecent?.EnqueuedTimeUtc;
        }

        [HttpPost]
        [Route("queues/update")]
        public void UpdateQueue([FromBody]VengaQueueUpload queueData)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            QueueDescription description = namespaceManager.GetQueue(queueData.name);
            ApplyDescriptionChanges(description, queueData);

            namespaceManager.UpdateQueue(description);
        }

        public void ApplyDescriptionChanges(QueueDescription existingDescription, VengaQueueUpload updateData)
        {
            existingDescription.SupportOrdering = updateData.supportOrdering;
            existingDescription.RequiresSession = updateData.requiresSession;
            existingDescription.EnablePartitioning = updateData.enablePartitioning;
            existingDescription.AutoDeleteOnIdle = updateData.autoDeleteOnIdle.AsTimeSpan();
            existingDescription.EnableDeadLetteringOnMessageExpiration =
                updateData.enableDeadLetteringOnMessageExpiration;
            existingDescription.MaxDeliveryCount = updateData.maxDeliveryCount;
            existingDescription.MaxSizeInMegabytes = updateData.maxSizeInMegabytes;
            existingDescription.RequiresDuplicateDetection = updateData.requiresDuplicateDetection;
            existingDescription.Status = updateData.status;
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