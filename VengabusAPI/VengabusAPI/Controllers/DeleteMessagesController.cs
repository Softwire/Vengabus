using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{

    public class DeleteMessagesController : ApiController
    {

        [HttpPost]
        [Route("deleteMessages/queue/{queueName}")]
        //delete all messages in a given queue
        public void DeleteAllMessagesInQueue()
        {
            throw new NotImplementedException();
        }


        [HttpPost]
        [Route("deleteMessages/subscription/{subscriptionName}")]
        //delete all messages in a given subscription
        public void DeleteAllMessagesInSubscription()
        {


            throw new NotImplementedException();
        }


    }
}