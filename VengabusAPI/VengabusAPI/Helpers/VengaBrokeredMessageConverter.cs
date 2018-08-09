using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Security.Cryptography;
using System.Text;

namespace VengabusAPI.Models
{
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

            string messageBody = brokeredMessage.GetBody<string>();
            string stringToHash = brokeredMessage.MessageId + messageBody + brokeredMessage.EnqueuedTimeUtc;
            Guid guid;
            using (MD5 md5 = MD5.Create())
            {
                byte[] hash = md5.ComputeHash(Encoding.Default.GetBytes(stringToHash));
                guid = new Guid(hash);
            }

            return new VengaMessage(customProperties, predefinedProperties, messageBody, guid.ToString());
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
    }
}