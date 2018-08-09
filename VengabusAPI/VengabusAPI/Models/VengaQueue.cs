using Microsoft.ServiceBus.Messaging;
using System;
using System.Collections.Generic;

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
            supportOrdering = queueFromAzure.SupportOrdering;
        }

        public VengaQueue(Dictionary<string, dynamic> queue)
        {
            name = queue["name"];
            activeMessageCount = queue["activeMessageCount"];
            deadletterMessageCount = queue["deadletterMessageCount"];
            supportOrdering = queue["supportOrdering"];
            mostRecentDeadLetter = queue["mostRecentDeadLetter"];
        }

        public string name { get; set; }
        public long activeMessageCount { get; }
        public long deadletterMessageCount { get; }
        public bool supportOrdering { get; set; }
    }
}