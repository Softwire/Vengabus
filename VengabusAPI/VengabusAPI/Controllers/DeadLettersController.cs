using System.Collections.Generic;
using System.Web.Http;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{
    public class DeadLettersController : MessagesController
    {
     
        [HttpGet]
        [Route("queues/{queueName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInQueue(string queueName)
        {
            return GetMessagesFromEndpoint(GetDeadLetterQueue(queueName));
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInSubscription(string topicName, string subscriptionName)
        {
 
            return GetMessagesFromEndpoint(GetDeadLetterSubscription(subscriptionName, topicName));
        }

        [HttpDelete]
        [Route("queues/{queueName}/deadletters/{uniqueId}")]
        public void DeleteSingleDeadLetterMessageInQueue(string queueName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(GetDeadLetterQueue(queueName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters/{uniqueId}")]
        public void DeleteSingleDeadLetterMessageInSubscription(string topicName, string subscriptionName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(GetDeadLetterSubscription(subscriptionName, topicName), messageId, uniqueId);
        }
    }
}

