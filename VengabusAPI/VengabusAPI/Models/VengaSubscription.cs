using Microsoft.ServiceBus.Messaging;
using System;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.subscriptiondescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    public class VengaSubscription
    {
        public VengaSubscription(SubscriptionDescription subscriptionFromAzure)
        {
            name = subscriptionFromAzure.Name;
            activeMessageCount = subscriptionFromAzure.MessageCountDetails.ActiveMessageCount;
            deadletterMessageCount = subscriptionFromAzure.MessageCountDetails.DeadLetterMessageCount;
            subscriptionStatus = subscriptionFromAzure.Status;
        }

        public string name { get; set; }
        public long activeMessageCount { get; set; }
        public long deadletterMessageCount { get; set; }
        public Microsoft.ServiceBus.Messaging.EntityStatus subscriptionStatus { get; set; }
    }

}