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
            autoDeleteOnIdle = queueFromAzure.AutoDeleteOnIdle;
            activeMessageCount = queueFromAzure.MessageCountDetails.ActiveMessageCount;
            deadletterMessageCount = queueFromAzure.MessageCountDetails.DeadLetterMessageCount;
            enablePartitioning = queueFromAzure.EnablePartitioning;
            requiresSession = queueFromAzure.RequiresSession;
            supportOrdering = queueFromAzure.SupportOrdering;
        }

        public string name { get; set; }
        public TimeSpan autoDeleteOnIdle { get; set; }
        public long activeMessageCount { get; }
        public long deadletterMessageCount { get; }
        public bool enablePartitioning { get; set; }
        public bool requiresSession { get; set; }
        public bool supportOrdering { get; set; }
    }
}