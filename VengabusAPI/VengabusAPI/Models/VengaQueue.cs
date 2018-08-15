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

    public class TimeSpanFromFrontEnd
    {
        public string milliseconds { get; set; }
        public string seconds { get; set; }
        public string minutes { get; set; }
        public string hours { get; set; }
        public string days { get; set; }

        public TimeSpan AsTimeSpan()
        {
            return new TimeSpan(int.Parse(days), int.Parse(hours), int.Parse(minutes), int.Parse(seconds), int.Parse(milliseconds));
        }
    }

    public class VengaQueueUpload
    {
        public string name { get; set; }
        public TimeSpanFromFrontEnd autoDeleteOnIdle { get; set; }
        public long activeMessageCount { get; }
        public long deadletterMessageCount { get; }
        public bool enablePartitioning { get; set; }
        public bool requiresSession { get; set; }
        public bool supportOrdering { get; set; }
        public DateTime? mostRecentDeadLetter { get; }
    }
}