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

    public class SubscriptionsController : ApiController
    {
        
        [HttpGet]
        [Route("subscriptions/list/{topicName}")]
        //list all subscriptions in a given topic
        public void GetSubscriptions(string topicName)
        {
            //see queues/list in QueuesController for an idea of how to structure this
            throw new NotImplementedException();
        }
    


    }
}