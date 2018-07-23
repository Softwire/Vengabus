﻿using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{

    public class DeadLettersController : VengabusController
    {

        [HttpGet]
        [Route("deadLetters/queue/{queueName}")]
        public void ViewQueueDeadLetterMessages(string queueName)
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("deadLetters/subscription/{subscriptionName}")]
        public void ViewSubscriptionDeadLetterMessages(string subscriptionName)
        {
            throw new NotImplementedException();
        }

    }
}
