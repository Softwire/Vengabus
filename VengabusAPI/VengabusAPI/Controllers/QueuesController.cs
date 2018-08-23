﻿using System;
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

            var queues = namespaceManager.GetQueues().Select(q => new VengaQueue(q, GetTimeStampOfMostRecentDeadletter(q.Path)));
            return queues.OrderBy(q => q.name, StringComparer.CurrentCultureIgnoreCase);


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
            var endpoint = new QueueDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), queueName);
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint);
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