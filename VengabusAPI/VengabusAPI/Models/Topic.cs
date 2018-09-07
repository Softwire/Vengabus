using System;
using Microsoft.ServiceBus.Messaging;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.topicdescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    /// <summary>
    ///   Topic information displayed on HomePage ('TwoListDisplay')
    /// </summary>
    public class TopicSummary
    {
        //See flattening and restructuring actions in TopicCrud.jsx
        public static TopicSummary New(TopicDescription topicFromAzure)
        {
            return NewForDetails(topicFromAzure);
        }

        protected static TopicDetails NewForDetails(TopicDescription topicFromAzure)
        {
            return new TopicDetails
            {
                name = topicFromAzure.Path,
                subscriptionCount = topicFromAzure.SubscriptionCount,
                topicStatus = topicFromAzure.Status
            };
        }

        public string name { get; set; }
        public long subscriptionCount { get; set; }
        public EntityStatus topicStatus { get; set; }
        //qq maybe add a collection of subscriptions in here, in future?

        public virtual void ApplyChangesToDescription(TopicDescription existingDescription)
        {
            //name and subscriptionCount cannot be editted here.
            existingDescription.Status = topicStatus;
        }
    }

    /// <summary>
    ///   Topic Information displayed and edittable on CRUD page.
    /// </summary>
    public class TopicDetails : TopicSummary
    {
        public new static TopicDetails New(TopicDescription topicFromAzure)
        {
            var details = TopicSummary.NewForDetails(topicFromAzure);
            details.enablePartitioning = topicFromAzure.EnablePartitioning;
            details.supportOrdering = topicFromAzure.SupportOrdering;
            details.autoDeleteOnIdle = topicFromAzure.AutoDeleteOnIdle.AsObjectForFrontEnd();
            details.requiresDuplicateDetection = topicFromAzure.RequiresDuplicateDetection;
            details.maxSizeInMegabytes = topicFromAzure.MaxSizeInMegabytes;
            return details;
        }

        public bool enablePartitioning { get; set; }
        public bool supportOrdering { get; set; }
        public TimeSpanFromFrontend autoDeleteOnIdle { get;  set; }
        public bool requiresDuplicateDetection { get; set; }
        public long maxSizeInMegabytes { get; set; }

        public override void ApplyChangesToDescription(TopicDescription existingDescription)
        {
            base.ApplyChangesToDescription(existingDescription);

            existingDescription.SupportOrdering = supportOrdering;
            existingDescription.EnablePartitioning = enablePartitioning;
            existingDescription.AutoDeleteOnIdle = autoDeleteOnIdle.AsTimeSpan();
            existingDescription.RequiresDuplicateDetection = requiresDuplicateDetection;
            existingDescription.MaxSizeInMegabytes = maxSizeInMegabytes;
        }
    }
}