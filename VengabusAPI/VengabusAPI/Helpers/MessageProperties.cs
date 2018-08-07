using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Globalization;

namespace VengabusAPI.Models
{
    public static class MessageProperties
    {
        private const string DATETIME_STRING_FORMAT = "O";
        private static string FormatDateTime(DateTime input) => input.ToString(DATETIME_STRING_FORMAT, CultureInfo.InvariantCulture);
        private static DateTime ParseDateTime(string input) => DateTime.ParseExact(input, DATETIME_STRING_FORMAT, CultureInfo.InvariantCulture);

        private static readonly Dictionary<string, Action<BrokeredMessage, object>> setBrokeredMessagePropertyActions =
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
            {"ScheduledEnqueueTimeUtc", (message, value) => message.ScheduledEnqueueTimeUtc = ParseDateTime((string) value) },
            {"SessionId", (message, value) => message.SessionId = (string) value },
            {"TimeToLive", (message, value) => message.TimeToLive = TimeSpan.Parse((string) value) },
            {"To", (message, value) => message.To = (string) value },
            {"ViaPartitionKey", (message, value) => message.ViaPartitionKey = (string) value }
         };

        private static readonly Dictionary<string, Func<BrokeredMessage, object>> getBrokeredMessagePropertyFunctions =
        new Dictionary<string, Func<BrokeredMessage, object>>
        {
            // ReSharper disable ConvertToLambdaExpression
            //Getters that can be set.
            {"ContentType", (message) => { return message.ContentType; } },
            {"CorrelationId", (message) => { return message.CorrelationId; } },
            {"ForcePersistence", (message) => { return message.ForcePersistence; } },
            {"Label", (message) => { return message.Label; } },
            {"MessageId", (message) => { return message.MessageId; } },
            {"PartitionKey", (message) => { return message.PartitionKey; } },
            {"ReplyTo", (message) => { return message.ReplyTo; } },
            {"ReplyToSessionId", (message) => { return message.ReplyToSessionId; } },
            {"ScheduledEnqueueTimeUtc", (message) => { return FormatDateTime(message.ScheduledEnqueueTimeUtc); } },
            {"SessionId", (message) => { return message.SessionId; } },
            {"TimeToLive", (message) => { return message.TimeToLive; } },
            {"To", (message) => { return message.To; } },
            {"ViaPartitionKey", (message) => { return message.ViaPartitionKey; } },
            //The properties below can only be get
            {"DeadLetterSource", (message) => { return message.DeadLetterSource; } },
            {"DeliveryCount", (message) => { return message.DeliveryCount; } },
            {"EnqueuedSequenceNumber", (message) => { return message.EnqueuedSequenceNumber; } },
            {"EnqueuedTimeUtc", (message) => { return FormatDateTime(message.EnqueuedTimeUtc); } },
            {"ExpiresAtUtc", (message) => { return FormatDateTime(message.ExpiresAtUtc); } },
            {"IsBodyConsumed", (message) => { return message.IsBodyConsumed; } },
            {"LockedUntilUtc", (message) => { return FormatDateTime(message.LockedUntilUtc); } },
            {"LockToken", (message) => { return message.LockToken; } },
            {"SequenceNumber", (message) => { return message.SequenceNumber; } },
            {"Size", (message) => { return message.Size; } },
            {"State", (message) => { return message.State; } }
            // ReSharper restore ConvertToLambdaExpression
        };

        public static IEnumerable<string> SupportedSetProperties => setBrokeredMessagePropertyActions.Keys;
        public static IEnumerable<string> SupportedGetProperties => getBrokeredMessagePropertyFunctions.Keys;

        public static object GetProperty(BrokeredMessage message, string property)
        {
            var getPropertyFunction = getBrokeredMessagePropertyFunctions[property];
            return getPropertyFunction(message);
        }

        public static void SetProperty(BrokeredMessage message, string propertyName, object propertyValue)
        {
            var setPropertyFunction = setBrokeredMessagePropertyActions[propertyName];
            setPropertyFunction(message, propertyValue);
        }

    }
}