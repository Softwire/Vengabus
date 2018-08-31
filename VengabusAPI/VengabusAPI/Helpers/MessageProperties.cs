using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Linq;
using System.Globalization;
using Newtonsoft.Json.Serialization;

namespace VengabusAPI.Helpers
{
    public static class MessageProperties
    {
        private const string DATETIME_STRING_FORMAT = "O";
        private static string FormatDateTime(DateTime input) => input.ToString(DATETIME_STRING_FORMAT, CultureInfo.InvariantCulture);
        private static DateTime ParseDateTime(string input) => DateTime.ParseExact(input, DATETIME_STRING_FORMAT, CultureInfo.InvariantCulture);
        
        private const string TIMESPAN_STRING_FORMAT = "O";
        private static string FormatTimeSpan(TimeSpan input) => input.ToString(DATETIME_STRING_FORMAT, CultureInfo.InvariantCulture);
        private static TimeSpan ParseTimeSpan(string input) => TimeSpan.ParseExact(input, DATETIME_STRING_FORMAT, CultureInfo.InvariantCulture);

        /// <remarks>
        ///   Case Insensitivity.
        ///   
        ///   These dictionaries are used in returning messages as well as returning the set of properties allowed to be get/set.
        ///   However, when returning a dictionary (in message), C# webapi changes keys to camelCase instead;
        ///   In contrast, we return the collection of properties allowed as an array of strings, which have their original casing retained.
        ///   As a result, the frontend gets two versions of property names that mismatch, which causes problems when trying to replay messages.
        ///   We decide that, we'll return camelCase as well for the collection of available properties,
        ///   and that casing should not matter when trying to get/set properties from Vengamessage property.
        ///   StringComparer.OrdinalIgnoreCase will ignore cases in keys, and
        ///   we use CamelCasePropertyNamesContractResolver below in the collection of properties
        ///   to convert keys to camelCase.
        /// </remarks>
        private static readonly Dictionary<string, Action<BrokeredMessage, object>> setBrokeredMessagePropertyActions =
         new Dictionary<string, Action<BrokeredMessage, object>>(StringComparer.OrdinalIgnoreCase)
         {
            {"ContentType", (message, value) => message.ContentType = (string) value },
            {"CorrelationId", (message, value) => message.CorrelationId = (string) value },
            {"ForcePersistence", (message, value) => message.ForcePersistence = (bool) bool.Parse(value.ToString()) },
            {"Label", (message, value) => message.Label = (string) value },
            {"MessageId", (message, value) => message.MessageId = (string) value },
            {"PartitionKey", (message, value) => message.PartitionKey = (string) value },
            {"ReplyTo", (message, value) => message.ReplyTo = (string) value },
            {"ReplyToSessionId", (message, value) => message.ReplyToSessionId = (string) value },
            {"ScheduledEnqueueTimeUtc", (message, value) => message.ScheduledEnqueueTimeUtc = (DateTime) value },   // DateTime gets parsed automatically by WebApi, apparently.
            {"SessionId", (message, value) => message.SessionId = (string) value },
            {"TimeToLive", (message, value) => message.TimeToLive = TimeSpan.Parse((string) value) },
            {"To", (message, value) => message.To = (string) value },
            {"ViaPartitionKey", (message, value) => message.ViaPartitionKey = (string) value }
         };

        private static readonly Dictionary<string, Func<BrokeredMessage, object>> getBrokeredMessagePropertyFunctions =
        new Dictionary<string, Func<BrokeredMessage, object>>(StringComparer.OrdinalIgnoreCase)
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
            {"DeadletterSource", (message) => { return message.DeadLetterSource; } },
            {"DeliveryCount", (message) => { return message.DeliveryCount; } },
            {"EnqueuedSequenceNumber", (message) => { return message.EnqueuedSequenceNumber; } },
            {"EnqueuedTimeUtc", (message) => { return FormatDateTime(message.EnqueuedTimeUtc); } },
            {"ExpiresAtUtc", (message) => { return FormatDateTime(message.ExpiresAtUtc); } },
            {"LockedUntilUtc", (message) => { return FormatDateTime(message.LockedUntilUtc); } },
            {"LockToken", (message) => { return message.LockToken; } },
            {"SequenceNumber", (message) => { return message.SequenceNumber; } },
            {"Size", (message) => { return message.Size; } },
            {"State", (message) => { return message.State; } }
            //{"IsBodyConsumed", (message) => { return message.IsBodyConsumed; } }, This property is only relevant to the C# object, not the actual message
            // ReSharper restore ConvertToLambdaExpression
        };

        public static IEnumerable<string> SupportedSetProperties
        {
            get
            {
                var camelCaser = new CamelCasePropertyNamesContractResolver();
                return setBrokeredMessagePropertyActions.Keys.Select(camelCaser.GetResolvedPropertyName);
            }
        }

        public static IEnumerable<string> SupportedGetProperties
        {
            get
            {
                var camelCaser = new CamelCasePropertyNamesContractResolver();
                return getBrokeredMessagePropertyFunctions.Keys.Select(camelCaser.GetResolvedPropertyName);
            }
        }

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