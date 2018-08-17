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
            topicName = subscriptionFromAzure.TopicPath;
        }

        public string name { get; }
        public long activeMessageCount { get; }
        public long deadletterMessageCount { get; }
        public EntityStatus subscriptionStatus { get; set; }
        public string topicName { get; }
    }

    public class VengaSubscriptionUpload
    {
        public string name { get; }
        public long activeMessageCount { get; }
        public long deadletterMessageCount { get; }
        public DateTime? mostRecentDeadLetter { get; }
        public EntityStatus subscriptionStatus { get; set; }
        public string topicName { get; }
    }

}