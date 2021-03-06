﻿using System.Linq;
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
        public IEnumerable<SubscriptionSummary> ListSubscriptions(string topicName)
        {
            var namespaceManager = CreateNamespaceManager();
            var azureSubscriptionsEnum =  namespaceManager.GetSubscriptions(topicName);

            var subscriptions = azureSubscriptionsEnum.Select(s => SubscriptionSummary.New(s));
            return subscriptions.OrderBy(s => s.name, StringComparer.CurrentCultureIgnoreCase);
        }

        [HttpGet]
        [Route("subscriptions/{parentTopicName}/{subscriptionName}")]
        public SubscriptionDetails GetDetails(string parentTopicName, string subscriptionName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
    
            return SubscriptionDetails.New(namespaceManager.GetSubscription(parentTopicName, subscriptionName));
        }

        [HttpGet]
        [Route("subscriptions/{parentTopicName}/{subscriptionName}/mostRecentDeadletter")]
        public DateTime? GetTimeStampOfMostRecentDeadletter(string parentTopicName, string subscriptionName)
        {
            var endpoint = new SubscriptionDeadletterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), parentTopicName, subscriptionName);
            var deadletterList = MessageServices.GetMessagesFromEndpoint(endpoint);
            var mostRecent = deadletterList.OrderByDescending(x => x.EnqueuedTimeUtc).FirstOrDefault();
            return mostRecent?.EnqueuedTimeUtc;
        }

        [HttpPost]
        [Route("subscriptions/update")]
        public void UpdateSubscription([FromBody]SubscriptionDetails subData)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            SubscriptionDescription description = namespaceManager.GetSubscription(subData.topicName, subData.name);
            subData.ApplyChangesToDescription(description);

            namespaceManager.UpdateSubscription(description);
        }

        [HttpDelete]
        [Route("subscriptions/delete/{topicName}/{subscriptionName}")]
        public void DeleteSubscription(string topicName, string subscriptionName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            namespaceManager.DeleteSubscription(topicName, subscriptionName);
        }
    }
}