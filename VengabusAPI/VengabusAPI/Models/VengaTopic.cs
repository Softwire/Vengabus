using System;
using Microsoft.ServiceBus.Messaging;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.topicdescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    public class VengaTopic
    {
        public VengaTopic(TopicDescription topicFromAzure)
        {
            name = topicFromAzure.Path;
            subscriptionCount = topicFromAzure.SubscriptionCount;
            topicStatus = topicFromAzure.Status;
            enablePartitioning = topicFromAzure.EnablePartitioning;
            supportOrdering = topicFromAzure.SupportOrdering;
            autoDeleteOnIdle = topicFromAzure.AutoDeleteOnIdle;
            requiresDuplicateDetection = topicFromAzure.RequiresDuplicateDetection;
            maxSizeInMegabytes = topicFromAzure.MaxSizeInMegabytes;
            //qq maybe add a collection of subscriptions in here, in future?
        }

        public string name { get; }
        public long subscriptionCount { get; }
        public EntityStatus topicStatus { get; set; }
        public bool enablePartitioning { get; set; }
        public bool supportOrdering { get; set; }
        public TimeSpan autoDeleteOnIdle { get; set; }
        public bool requiresDuplicateDetection { get; set; }
        public long maxSizeInMegabytes { get; set; }
    }

    public class VengaTopicUpload
    {
        public string name { get; }
        public long subscriptionCount { get; }
        public EntityStatus topicStatus { get; set; }
        public bool enablePartitioning { get; set; }
        public bool supportOrdering { get; set; }
        public TimeSpanFromFrontend autoDeleteOnIdle { get; set; }
        public bool requiresDuplicateDetection { get; set; }
        public long maxSizeInMegabytes { get; set; }

        public void ApplyChangesToDescription(TopicDescription existingDescription)
        {
            existingDescription.SupportOrdering = supportOrdering;
            existingDescription.EnablePartitioning = enablePartitioning;
            existingDescription.AutoDeleteOnIdle = autoDeleteOnIdle.AsTimeSpan();
            existingDescription.Status = topicStatus;
            existingDescription.RequiresDuplicateDetection = requiresDuplicateDetection;
            existingDescription.MaxSizeInMegabytes = maxSizeInMegabytes;
        }
    }

}