using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;

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
                    predefinedProperties[property] = MessageProperties.GetProperty(brokeredMessage, property);
                }
                catch (Exception e)
                {
                    predefinedProperties[property] = "Property unavailable: " + e.ToString();
                }
            }

            return new VengaMessage(customProperties, predefinedProperties, brokeredMessage.GetBody<string>());
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