using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{

    public class DeadLettersController : ApiController
    {

        [HttpGet]
        [Route("deadLetters/queue/{queueName}")]
        //view all dead-letter messages in a given queue
        public void ViewQueueDeadLettersMessages()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("deadLetters/subscription/{subscriptionName}")]
        //view all dead-letter messages in a given subscription
        public void ViewTopicDeadLettersMessages()
        {
            throw new NotImplementedException();
        }

    }
}
