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

    public class TopicsController : VengabusController
    {
        
        [HttpGet]
        [Route("topics/list")]
        //list all topics in a service bus
        public IEnumerable<VengaTopic> ListTopics()
        {
            var namespaceManager = CreateNamespaceManager();
            return namespaceManager.GetTopics().Select(t => new VengaTopic(t));
        }
    }
}
 