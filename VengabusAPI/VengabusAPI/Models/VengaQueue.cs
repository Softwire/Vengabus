using Microsoft.ServiceBus.Messaging;

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