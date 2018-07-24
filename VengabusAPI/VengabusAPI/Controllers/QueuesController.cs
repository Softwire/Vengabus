using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{
    public class QueuesController : VengabusController
    {
        [HttpGet]
        [Route("queues/list")]
        public IEnumerable<VengaQueue> ListQueues()        {
            const string address = "https://vengabusdemo.servicebus.windows.net/";
           
            var namespaceManager = new NamespaceManager(address, GetSASToken());

            return namespaceManager.GetQueues().Select(q => new VengaQueue(q));
        }
        
    }
}