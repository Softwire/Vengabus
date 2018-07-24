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
            //qq maybe add a collection of subscriptions in here, in future?
        }

        public string name { get; set; }
        public long subscriptionCount { get; set; }
        public Microsoft.ServiceBus.Messaging.EntityStatus topicStatus { get; set; }
    }

}