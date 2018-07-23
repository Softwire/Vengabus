using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{
    public class AzureTopic
    {
        //see the class AzureQueue in QueuesController.cs and implement similar?
    }


    public class TopicsController : ApiController
    {
        
        [HttpGet]
        [Route("topics/list")]
        //list all topics
        public void GetTopics()
        {
            //see queues/list in QueuesController for an idea of how to structure this
            throw new NotImplementedException();
        }

        [HttpPost]
        [Route("topics/wipeSubscriptions/{topicName}")]
        //delete all messages in all the subscriptions for a given topic
        public void DeleteAllMessagesInSubscriptionsInTopic()
        {
            throw new NotImplementedException();
        }





    }
}