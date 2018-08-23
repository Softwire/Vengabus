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
        public IEnumerable<VengaSubscription> ListSubscriptions(string topicName)
        {
            var namespaceManager = CreateNamespaceManager();
            var azureSubscriptionsEnum =  namespaceManager.GetSubscriptions(topicName);

            var subscriptions = azureSubscriptionsEnum.Select(s => new VengaSubscription(s, GetTimeStampOfMostRecentDeadletter(topicName, s.Name)));
            return subscriptions.OrderBy(s => s.name, StringComparer.CurrentCultureIgnoreCase);
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
            var endpoint = new SubscriptionDeadLetterEndpoint(CreateNamespaceManager(), CreateEndpointFactory(), subscriptionName, topicName);
            var deadLetterList = MessageServices.GetMessagesFromEndpoint(endpoint);
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