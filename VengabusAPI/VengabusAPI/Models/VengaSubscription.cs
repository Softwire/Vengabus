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
            autoDeleteOnIdle = subscriptionFromAzure.AutoDeleteOnIdle;
            enableDeadletteringOnMessageExpiration = subscriptionFromAzure.EnableDeadLetteringOnMessageExpiration;
            maxDeliveryCount = subscriptionFromAzure.MaxDeliveryCount;
            requiresSession = subscriptionFromAzure.RequiresSession;
        }

        public string name { get; }
        public long activeMessageCount { get; }
        public long deadletterMessageCount { get; }
        public EntityStatus subscriptionStatus { get; set; }
        public string topicName { get; }
        public TimeSpan autoDeleteOnIdle { get; set; }
        public bool enableDeadletteringOnMessageExpiration { get; set; }
        public int maxDeliveryCount { get; set; }
        public bool requiresSession { get; set; }
    }

    public class VengaSubscriptionUpload
    {
        public string name { get; }
        public long activeMessageCount { get; }
        public long deadletterMessageCount { get; }
        public DateTime? mostRecentDeadletter { get; }
        public EntityStatus subscriptionStatus { get; set; }
        public string topicName { get; }
        public TimeSpanFromFrontend autoDeleteOnIdle { get; set; }
        public bool enableDeadletteringOnMessageExpiration { get; set; }
        public int maxDeliveryCount { get; set; }
        public bool requiresSession { get; set; }

        public void ApplyChangesToDescription(SubscriptionDescription existingDescription)
        {
            existingDescription.Status = subscriptionStatus;
            existingDescription.AutoDeleteOnIdle = autoDeleteOnIdle.AsTimeSpan();
            existingDescription.EnableDeadLetteringOnMessageExpiration = enableDeadletteringOnMessageExpiration;
            existingDescription.MaxDeliveryCount = maxDeliveryCount;
            existingDescription.RequiresSession = requiresSession;
        }
    }

}