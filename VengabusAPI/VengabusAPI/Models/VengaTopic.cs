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
            //qq maybe add a collection of subscriptions in here, in future?
        }

        public string name { get; set; }
        public long subscriptionCount { get; set; }
        public Microsoft.ServiceBus.Messaging.EntityStatus topicStatus { get; set; }
        public bool enablePartitioning { get; set; }
        public bool supportOrdering { get; set; }
        public TimeSpan autoDeleteOnIdle { get; set; }
    }

    public class VengaTopicUpload
    {
        public string name { get; set; }
        public long subscriptionCount { get; set; }
        public EntityStatus topicStatus { get; set; }
        public bool enablePartitioning { get; set; }
        public bool supportOrdering { get; set; }
        public TimeSpanFromFrontend autoDeleteOnIdle { get; set; }
    }

}