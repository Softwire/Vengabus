﻿using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{



    public class ListMessagesController : ApiController
    {

        //[HttpGet]
        [Route("listMessages/queue/{queueName}")]
        //list the messages in a given queue
        public void ListMessagesInQueue()
        {
            throw new NotImplementedException();
        }


        //[HttpGet]
        [Route("listMessages/subscription/{subscriptionName}")]
        //list the messages in a given subscription
        public void ListMessagesInSubscription()
        {
            throw new NotImplementedException();
        }


    }
}