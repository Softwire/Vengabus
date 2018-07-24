using Microsoft.ServiceBus.Messaging;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.queuedescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    public class VengaQueue
    {
        public VengaQueue(QueueDescription queueFromAzure)
        {
            name = queueFromAzure.Path;
            activeMessageCount = queueFromAzure.MessageCountDetails.ActiveMessageCount;
            deadletterMessageCount = queueFromAzure.MessageCountDetails.DeadLetterMessageCount;
        }

        public string name { get; set; }
        public long activeMessageCount { get; set; }
        public long deadletterMessageCount { get; set; }
    }
}