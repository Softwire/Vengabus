using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;

namespace VengabusAPI.Models
{
    public class MessageProperties
    {
        public readonly static Dictionary<string, Action<BrokeredMessage, object>> setBrokeredMessagePropertyActions =
         new Dictionary<string, Action<BrokeredMessage, object>>
         {
            {"ContentType", (message, value) => message.ContentType = (string) value },
            {"CorrelationId", (message, value) => message.CorrelationId = (string) value },
            {"ForcePersistence", (message, value) => message.ForcePersistence = (bool) value },
            {"Label", (message, value) => message.Label = (string) value },
            {"MessageId", (message, value) => message.MessageId = (string) value },
            {"PartitionKey", (message, value) => message.PartitionKey = (string) value },
            {"ReplyTo", (message, value) => message.ReplyTo = (string) value },
            {"ReplyToSessionId", (message, value) => message.ReplyToSessionId = (string) value },
            {"ScheduledEnqueueTimeUtc", (message, value) => message.ScheduledEnqueueTimeUtc = (DateTime) value },
            {"SessionId", (message, value) => message.SessionId = (string) value },
            {"TimeToLive", (message, value) => message.TimeToLive = (TimeSpan) value },
            {"To", (message, value) => message.To = (string) value },
            {"ViaPartitionKey", (message, value) => message.ViaPartitionKey = (string) value }
         };

        public readonly static Dictionary<string, Func<BrokeredMessage, object>> getBrokeredMessagePropertyFunctions =
        new Dictionary<string, Func<BrokeredMessage, object>>
        {
            //Getters that can be set.
            {"ContentType", (message) => {return message.ContentType; } },
            {"CorrelationId", (message) => {return message.CorrelationId; } },
            {"ForcePersistence", (message) => {return message.ForcePersistence; } },
            {"Label", (message) => {return message.Label; } },
            {"MessageId", (message) => {return message.MessageId; } },
            {"PartitionKey", (message) => {return message.PartitionKey; } },
            {"ReplyTo", (message) => {return message.ReplyTo; } },
            {"ReplyToSessionId", (message) => {return message.ReplyToSessionId; } },
            {"ScheduledEnqueueTimeUtc", (message) => {return message.ScheduledEnqueueTimeUtc; } },
            {"SessionId", (message) => {return message.SessionId; } },
            {"TimeToLive", (message) => {return message.TimeToLive; } },
            {"To", (message) => {return message.To; } },
            {"ViaPartitionKey", (message) => {return message.ViaPartitionKey; } },
            //The properties below can only be get
            {"DeadLetterSource", (message) => {return message.DeadLetterSource; } },
            {"DeliveryCount", (message) => {return message.DeliveryCount; } },
            {"EnqueuedSequenceNumber", (message) => {return message.EnqueuedSequenceNumber; } },
            {"EnqueuedTimeUtc", (message) => {return message.EnqueuedTimeUtc; } },
            {"ExpiresAtUtc", (message) => {return message.ExpiresAtUtc; } },
            {"IsBodyConsumed", (message) => {return message.IsBodyConsumed; } },
            {"LockedUntilUtc", (message) => {return message.LockedUntilUtc; } },
            {"LockToken", (message) => {return message.LockToken; } },
            {"SequenceNumber", (message) => {return message.SequenceNumber; } },
            {"Size", (message) => {return message.Size; } },
            {"State", (message) => {return message.State; } }
        };

        public static IEnumerable<string> SupportedSetProperties => setBrokeredMessagePropertyActions.Keys;
        public static IEnumerable<string> SupportedGetProperties => getBrokeredMessagePropertyFunctions.Keys;
    }
}