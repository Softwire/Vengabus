using System.Linq;
using System.Collections.Generic;
using System.Web.Http;
using Microsoft.ServiceBus;
using VengabusAPI.Models;
using System;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{

    public class SubscriptionsController : VengabusController
    {

        [HttpGet]
        [Route("subscriptions/{topicName}")]
        public IEnumerable<VengaSubscription> ListSubscriptions(string topicName)
        {
            var namespaceManager = CreateNamespaceManager();
            var azureSubscriptionsEnum =  namespaceManager.GetSubscriptions(topicName);

            var subscriptions = azureSubscriptionsEnum.Select(s => new VengaSubscription(s));
            return subscriptions.OrderBy(s => s.name, StringComparer.CurrentCultureIgnoreCase);
        }

        [HttpGet]
        [Route("subscriptions/{parentTopicName}/{subscriptionName}")]
        public VengaSubscription GetDetails(string parentTopicName, string subscriptionName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
    
            return new VengaSubscription(namespaceManager.GetSubscription(parentTopicName, subscriptionName));
        }

        [HttpGet]
        [Route("subscriptions/{parentTopicName}/{subscriptionName}/mostRecentDeadletter")]
        public DateTime? GetTimeStampOfMostRecentDeadletter(string parentTopicName, string subscriptionName)
        {
            var endpoint = new SubscriptionDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), subscriptionName, parentTopicName);
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint);
            var mostRecent = deadLetterList.OrderByDescending(x => x.EnqueuedTimeUtc).FirstOrDefault();
            return mostRecent?.EnqueuedTimeUtc;
        }

        [HttpPost]
        [Route("subscriptions/update")]
        public void UpdateQueue([FromBody]VengaSubscriptionUpload subData)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            SubscriptionDescription description = namespaceManager.GetSubscription(subData.topicName, subData.name);
            subData.ApplyChangesToDescription(description);

            namespaceManager.UpdateSubscription(description);
        }

        [HttpDelete]
        [Route("subscriptions/delete/{topicName}/{subscriptionName}")]
        public void DeleteQueue(string topicName, string subscriptionName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            namespaceManager.DeleteSubscription(topicName, subscriptionName);
        }
    }
}