using System.Collections.Generic;
using System.Web.Http;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{
    public class DeadLettersController : MessagesController
    {
     
        [HttpGet]
        [Route("queues/{queueName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInQueue(string queueName, int messageCount = int.MaxValue)
        {
            return GetMessagesFromEndpoint(GetDeadLetterQueue(queueName), messageCount);
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters")]
        public IEnumerable<VengaMessage> ListDeadLetterMessagesInSubscription(string topicName, string subscriptionName, int messageCount = int.MaxValue)
        {
            return GetMessagesFromEndpoint(GetDeadLetterSubscription(topicName, subscriptionName), messageCount);
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
            DeleteSingleMessageFromEndpoint(GetDeadLetterSubscription(topicName, subscriptionName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("queues/{queueName}/deadletters")]
        public void PurgeDeadletterMessagesInQueue(string queueName)
        {
            PurgeMessagesFromEndpoint(GetDeadLetterQueue(queueName));
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/deadletters")]
        public void PurgeDeadletterMessagesInSubscription(string topicName, string subscriptionName)
        {
            PurgeMessagesFromEndpoint(GetDeadLetterSubscription(topicName, subscriptionName));
        }

        [HttpDelete]
        [Route("topics/{topicName}/deadletters")]
        //delete all messages in all the subscriptions for a given topic
        public void PurgeDeadletterMessagesInTopic(string topicName)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                PurgeDeadletterMessagesInSubscription(topicName, subscriptionDescription.Name);
            }
        }
    }
}

