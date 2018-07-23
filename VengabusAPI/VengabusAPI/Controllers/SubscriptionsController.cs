using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{
    public class AzureSubscription
    {
        //see the class AzureQueue in QueuesController.cs and implement similar?
    }


    public class SubscriptionsController : ApiController
    {
        
        [HttpGet]
        [Route("subscriptions/list/{topicName}")]
        //list all subscriptions in a given topic
        public void GetSubscriptions()
        {
            //see queues/list in QueuesController for an idea of how to structure this
            throw new NotImplementedException();
        }
    


    }
}