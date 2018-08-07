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

            return azureSubscriptionsEnum.Select(s => new VengaSubscription(s, GetTimeStampOfMostRecentDeadletter(topicName, s.Name)));
        }

        [HttpGet]
        [Route("subscriptions/{parentTopicName}/{subscriptionName}")]
        public VengaSubscription GetDetails(string parentTopicName, string subscriptionName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            DateTime? timeStamp = GetTimeStampOfMostRecentDeadletter(parentTopicName, subscriptionName);
    
            return new VengaSubscription(namespaceManager.GetSubscription(parentTopicName, subscriptionName), timeStamp);
        }

        private DateTime? GetTimeStampOfMostRecentDeadletter(string topicName, string subscriptionName)
        {
            MessagingFactory factory = CreateEndpointFactory();
            var endpoint = EndpointIdentifier.ForSubscription(topicName, subscriptionName).GetDeadLetterEndpoint();
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint, factory);
            var mostRecent = deadLetterList.OrderByDescending(x => x.EnqueuedTimeUtc).FirstOrDefault();
            if (mostRecent != null)
            {
                return mostRecent.EnqueuedTimeUtc;
            }
            else
            {
                return null;
            }
        }


    }
}