using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Controllers;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.queuedescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    public class EndpointIdentifier
    {
        public static EndpointIdentifier ForQueue(string queueName)
        {
            return new EndpointIdentifier(EndpointType.Queue, queueName);
        }

        public static EndpointIdentifier ForTopic(string topicName)
        {
            return new EndpointIdentifier(EndpointType.Topic, topicName);
        }
        
        public static EndpointIdentifier ForSubscription(string topicName, string subscriptionName)
        {
            return new EndpointIdentifier(EndpointType.Subscription, subscriptionName, topicName);
        }

        private EndpointIdentifier(EndpointType endpointType, string endpointName, string parentTopicName = null)
        {
            Type = endpointType;
            Name = endpointName;
            ParentTopic = parentTopicName;
        }

        public string Name { get; set; }
        public EndpointType Type { get; set; }
        public string ParentTopic { get; set; }
    }
}