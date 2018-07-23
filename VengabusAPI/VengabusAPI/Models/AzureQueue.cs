using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{
    public class AzureQueue
    {
        public AzureQueue(QueueDescription queueFromAzure)
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