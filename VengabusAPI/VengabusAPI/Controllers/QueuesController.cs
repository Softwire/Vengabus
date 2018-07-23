using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{
    public class QueuesController : ApiController
    {
        
        [Route("queues/list")]
        public IEnumerable<AzureQueue> POST([FromBody]string SAS)
        {
            //var auth = Request.Headers.Authorization.Parameter;
            //input is the SAS string here
            const string address = "https://vengabusdemo.servicebus.windows.net/";
           
            var namespaceManager = new NamespaceManager(address, TokenProvider.CreateSharedAccessSignatureTokenProvider(SAS));

            return namespaceManager.GetQueues().Select(q => new AzureQueue(q));
        }
        
    }
}