using System;
using Microsoft.ServiceBus.Messaging;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.queuedescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    /// <summary>
    ///   Queue information displayed on HomePage ('TwoListDisplay')
    /// </summary>
    public class QueueSummary
    {
        public static QueueSummary New(QueueDescription queueFromAzure) => NewBase<QueueSummary>(queueFromAzure);
        protected static T NewBase<T>(QueueDescription queueFromAzure) where T : QueueSummary, new()
        {
            var ret = new T();
            ApplyDetails(ret, queueFromAzure);
            return ret;
        }

        private static void ApplyDetails<T>(T internalQueue, QueueDescription queueFromAzure) where T:QueueSummary
        {
            internalQueue.name = queueFromAzure.Path;
            internalQueue.activeMessageCount = queueFromAzure.MessageCountDetails.ActiveMessageCount;
            internalQueue.deadletterMessageCount = queueFromAzure.MessageCountDetails.DeadLetterMessageCount;
            internalQueue.status = queueFromAzure.Status;
        }

        public string name { get; set; }
        public long activeMessageCount { get; set; }
        public long deadletterMessageCount { get; set; }
        public EntityStatus status { get; set; }
        //qq maybe add a collection of subscriptions in here, in future?

        public virtual void ApplyChangesToDescription(QueueDescription existingDescription)
        {
            //name and messageCounts cannot be editted here.
            existingDescription.Status = status;
        }
    }

    /// <summary>
    ///   Queue Information displayed and edittable on CRUD page.
    /// </summary>
    public class QueueDetails : QueueSummary
    {
        public new static QueueDetails New(QueueDescription queueFromAzure)
        {
            var details = NewBase<QueueDetails>(queueFromAzure);
            details.autoDeleteOnIdle = queueFromAzure.AutoDeleteOnIdle.AsObjectForFrontEnd();
            details.enablePartitioning = queueFromAzure.EnablePartitioning;
            details.requiresSession = queueFromAzure.RequiresSession;
            details.supportOrdering = queueFromAzure.SupportOrdering;
            details.enableDeadletteringOnMessageExpiration = queueFromAzure.EnableDeadLetteringOnMessageExpiration;
            details.maxDeliveryCount = queueFromAzure.MaxDeliveryCount;
            details.maxSizeInMegabytes = queueFromAzure.MaxSizeInMegabytes;
            details.requiresDuplicateDetection = queueFromAzure.RequiresDuplicateDetection;
            return details;
        }

        public TimeSpanFromFrontend autoDeleteOnIdle { get; set; }
        public bool enablePartitioning { get; set; }
        public bool requiresSession { get; set; }
        public bool supportOrdering { get; set; }
        public bool enableDeadletteringOnMessageExpiration { get; set; }
        public int maxDeliveryCount { get; set; }
        public long maxSizeInMegabytes { get; set; }
        public bool requiresDuplicateDetection { get; set; }

        public override void ApplyChangesToDescription(QueueDescription existingDescription)
        {
            base.ApplyChangesToDescription(existingDescription);

            existingDescription.SupportOrdering = supportOrdering;
            existingDescription.RequiresSession = requiresSession;
            existingDescription.EnablePartitioning = enablePartitioning;
            existingDescription.AutoDeleteOnIdle = autoDeleteOnIdle.AsTimeSpan();
            existingDescription.EnableDeadLetteringOnMessageExpiration = enableDeadletteringOnMessageExpiration;
            existingDescription.MaxDeliveryCount = maxDeliveryCount;
            existingDescription.MaxSizeInMegabytes = maxSizeInMegabytes;
            existingDescription.RequiresDuplicateDetection = requiresDuplicateDetection;
        }
    }
}