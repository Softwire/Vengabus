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
    public class QueuesController : ApiController
    {
        [HttpGet]
        [Route("queues/list")]
        public IEnumerable<VengaQueue> ListQueues([FromBody]string SAS)
        {
            //var auth = Request.Headers.Authorization.Parameter;
            //input is the SAS string here
            const string address = "https://vengabusdemo.servicebus.windows.net/";
           
            var namespaceManager = new NamespaceManager(address, TokenProvider.CreateSharedAccessSignatureTokenProvider(SAS));

            return namespaceManager.GetQueues().Select(q => new VengaQueue(q));
        }
        
    }
}