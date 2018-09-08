using System;
using Microsoft.ServiceBus.Messaging;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.subscriptiondescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    /// <summary>
    ///   Subscription information displayed on HomePage ('TwoListDisplay')
    /// </summary>
    public class SubscriptionSummary
    {
        //See flattening and restructuring actions in SubscriptionCrud.jsx
        public static SubscriptionSummary New(SubscriptionDescription subscriptionFromAzure)
        {
            return NewForDetails(subscriptionFromAzure);
        }

        protected static SubscriptionDetails NewForDetails(SubscriptionDescription subscriptionFromAzure)
        {
            return new SubscriptionDetails
            {
                name = subscriptionFromAzure.Name,
                topicName = subscriptionFromAzure.TopicPath,
                activeMessageCount = subscriptionFromAzure.MessageCountDetails.ActiveMessageCount,
                deadletterMessageCount = subscriptionFromAzure.MessageCountDetails.DeadLetterMessageCount,
                subscriptionStatus = subscriptionFromAzure.Status
            };
        }

        public string name { get; set; }
        public string topicName { get; set; }
        public long activeMessageCount { get; set; }
        public long deadletterMessageCount { get; set; }
        public EntityStatus subscriptionStatus { get; set; }
        //qq maybe add a collection of subscriptions in here, in future?

        public virtual void ApplyChangesToDescription(SubscriptionDescription existingDescription)
        {
            //name and messageCounts cannot be editted here.
            existingDescription.Status = subscriptionStatus;
        }
    }

    /// <summary>
    ///   Subscription Information displayed and edittable on CRUD page.
    /// </summary>
    public class SubscriptionDetails : SubscriptionSummary
    {
        public new static SubscriptionDetails New(SubscriptionDescription subscriptionFromAzure)
        {
            var details = SubscriptionSummary.NewForDetails(subscriptionFromAzure);
            details.autoDeleteOnIdle = subscriptionFromAzure.AutoDeleteOnIdle.AsObjectForFrontEnd();
            details.requiresSession = subscriptionFromAzure.RequiresSession;
            details.enableDeadletteringOnMessageExpiration = subscriptionFromAzure.EnableDeadLetteringOnMessageExpiration;
            details.maxDeliveryCount = subscriptionFromAzure.MaxDeliveryCount;
            return details;
        }

        public TimeSpanFromFrontend autoDeleteOnIdle { get; set; }
        public bool requiresSession { get; set; }
        public bool enableDeadletteringOnMessageExpiration { get; set; }
        public int maxDeliveryCount { get; set; }

        public override void ApplyChangesToDescription(SubscriptionDescription existingDescription)
        {
            base.ApplyChangesToDescription(existingDescription);

            existingDescription.RequiresSession = requiresSession;
            existingDescription.AutoDeleteOnIdle = autoDeleteOnIdle.AsTimeSpan();
            existingDescription.EnableDeadLetteringOnMessageExpiration = enableDeadletteringOnMessageExpiration;
            existingDescription.MaxDeliveryCount = maxDeliveryCount;
        }
    }
}