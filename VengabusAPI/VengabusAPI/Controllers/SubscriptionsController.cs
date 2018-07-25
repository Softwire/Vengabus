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

    public class SubscriptionsController : VengabusController
    {

        [HttpGet]
        [Route("subscriptions/list/{topicName}")]
        public IEnumerable<VengaSubscription> ListSubscriptions(string topicName)
        {
            var namespaceManager = CreateNamespaceManager();
            var azureSubscriptionsEnum =  namespaceManager.GetSubscriptions(topicName);
            return azureSubscriptionsEnum.Select(s => new VengaSubscription(s));
        }


    }
}