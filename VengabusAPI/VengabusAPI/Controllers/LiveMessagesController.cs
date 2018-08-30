using System.Collections.Generic;
using System.Web.Http;
using VengabusAPI.Helpers;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{
    public class LiveMessagesController : MessagesController
    {

        [HttpGet]
        [Route("messages/properties/readable")]
        public IEnumerable<string> GetReadableProperties()
        {
            return MessageProperties.SupportedGetProperties;
        }

        [HttpGet]
        [Route("messages/properties/writeable")]
        public IEnumerable<string> GetWriteableProperties()
        {
            return MessageProperties.SupportedSetProperties;
        }

        [HttpPost]
        [Route("queues/{queueName}/messages")]
        public void SendMessageToQueue(string queueName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(GetQueue(queueName), message);
        }

        [HttpPost]
        [Route("topics/{topicName}/messages")]
        public void SendMessageToTopic(string topicName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(GetTopic(topicName), message);
        }

        [HttpPost]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        public void SendMessageToSubscription(string topicName, string subscriptionName, [FromBody]VengaMessage message)
        {
            SendMessageToEndpoint(GetTopic(topicName), message);
        }

        [HttpGet]
        [Route("queues/{queueName}/messages")]
        //list the messages in a given queue
        public IEnumerable<VengaMessage> ListMessagesInQueue(string queueName, [FromUri]int messageCount = int.MaxValue)
        {
            return GetMessagesFromEndpoint(GetQueue(queueName), messageCount);
        }

        [HttpGet]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        //list the messages in a given subscription
        public IEnumerable<VengaMessage> ListMessagesInSubscription(string topicName, string subscriptionName, [FromUri]int messageCount = int.MaxValue)
        {
            return GetMessagesFromEndpoint(GetSubscription(topicName, subscriptionName), messageCount);
        }

        //delete all messages in a given queue
        [HttpDelete]
        [Route("queues/{queueName}/messages")]
        public void PurgeMessagesInQueue(string queueName)
        {
            PurgeMessagesFromEndpoint(GetQueue(queueName));
        }

        [HttpDelete]
        [Route("queues/{queueName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInQueue(string queueName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(GetQueue(queueName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages")]
        //delete all messages in a given subscription
        public void PurgeMessagesInSubscription(string topicName, string subscriptionName)
        {
            PurgeMessagesFromEndpoint(GetSubscription(topicName, subscriptionName));
        }

        [HttpDelete]
        [Route("subscriptions/{topicName}/{subscriptionName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInSubscription(string topicName, string subscriptionName, string uniqueId, [FromUri]string messageId)
        {
            DeleteSingleMessageFromEndpoint(GetSubscription(topicName, subscriptionName), messageId, uniqueId);
        }

        [HttpDelete]
        [Route("topics/{topicName}/messages")]
        //delete all messages in all the subscriptions for a given topic
        public void PurgeMessagesInTopic(string topicName)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                PurgeMessagesInSubscription(topicName, subscriptionDescription.Name);
            }
        }

        [HttpDelete]
        [Route("topics/{topicName}/messages/{uniqueId}")]
        public void DeleteSingleMessageInTopic(string topicName, string uniqueId, [FromUri]string messageId)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                DeleteSingleMessageInSubscription(subscriptionDescription.Name, topicName, messageId, uniqueId);
            }
        }
    }
}