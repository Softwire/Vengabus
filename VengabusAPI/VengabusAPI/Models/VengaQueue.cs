using Microsoft.ServiceBus.Messaging;
using System;
//docs: https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.queuedescription?view=azure-dotnet
namespace VengabusAPI.Models
{
    public class VengaQueue
    {
        public VengaQueue(QueueDescription queueFromAzure, DateTime mostRecentDeadLetterArg)
        {
            name = queueFromAzure.Path;
            activeMessageCount = queueFromAzure.MessageCountDetails.ActiveMessageCount;
            deadletterMessageCount = queueFromAzure.MessageCountDetails.DeadLetterMessageCount;
            mostRecentDeadLetter = mostRecentDeadLetterArg;
        }

        public string name { get; set; }
        public long activeMessageCount { get; set; }
        public long deadletterMessageCount { get; set; }
        public DateTime mostRecentDeadLetter { get; set; }
    }
}