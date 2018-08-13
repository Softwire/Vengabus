using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Security.Cryptography;
using System.Text;
using VengabusAPI.Models;

namespace VengabusAPI.Helpers
{
    public class BodyAndHash
    {
        public string Body { get; }
        public Guid Hash { get; }
        public BodyAndHash(string body, Guid hash)
        {
            Body = body;
            Hash = hash;
        }
    }
    public static class BrokeredMessageExtantions
    {

        public static BodyAndHash GetBodyAndHash(this BrokeredMessage brokeredMessage)
        {
            string messageBody = brokeredMessage.GetBody<string>();
            return new BodyAndHash(messageBody, VengaBrokeredMessageConverter.GetMessageHash(brokeredMessage, messageBody));
        }
    }
    public static class VengaBrokeredMessageConverter
    {
        

        public static VengaMessage FromBrokeredMessage(BrokeredMessage brokeredMessage)
        {
            Dictionary<string, object> customProperties = new Dictionary<string, object>(brokeredMessage.Properties);
            Dictionary<string, object> predefinedProperties = new Dictionary<string, object>();

            foreach (var property in MessageProperties.SupportedGetProperties)
            {
                try
                {
                    var value = MessageProperties.GetProperty(brokeredMessage, property);
                    if (value != null)
                    {
                        predefinedProperties[property] = value;
                    }
                }
                catch (Exception e)
                {
                    predefinedProperties[property] = "Property unavailable: " + e.Message;
                }
            }

            BodyAndHash bodyAndHash = brokeredMessage.GetBodyAndHash();

            return new VengaMessage(customProperties, predefinedProperties, bodyAndHash.Body, bodyAndHash.Hash.ToString());
        }

        public static BrokeredMessage ToBrokeredMessage(VengaMessage vengaMessage)
        {
            var message = new BrokeredMessage(vengaMessage.MessageBody);
            //set predefined properties
            foreach (var property in vengaMessage.PredefinedProperties)
            {
                MessageProperties.SetProperty(message, property.Key, property.Value);
            }
            //set custom properties
            foreach (var property in vengaMessage.CustomProperties)
            {
                message.Properties.Add(property.Key, property.Value);
            }
            return message;
        }

        /**
         * For a message send to a topic, the resulting messages send to the subscription have the same enqueuedTimeUtc.
         * This means we have the same hash for all of those messages.
         * The SequenceNumber seems to be unique, but how bad the Service Bus is implemented, we also added the enqueued
         * time, message body and message id, to make sure the messages are uniquely identified.
         */
        public static Guid GetMessageHash(BrokeredMessage brokeredMessage, string messageBody)
        {
            string enqueuedTimeUtcString = $"{brokeredMessage.EnqueuedTimeUtc:MM/dd/yyyy/hh/mm/ss}";
            string stringToHash = brokeredMessage.MessageId + messageBody + enqueuedTimeUtcString + brokeredMessage.SequenceNumber;
            using (MD5 md5 = MD5.Create())
            {
                byte[] hash = md5.ComputeHash(Encoding.Default.GetBytes(stringToHash));
                return new Guid(hash);
            }
        }
    }
}