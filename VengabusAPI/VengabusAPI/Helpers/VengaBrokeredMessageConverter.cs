using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;

namespace VengabusAPI.Models
{
    public class VengaBrokeredMessageConverter
    {

        public static VengaMessage FromBrokeredMessage(BrokeredMessage brokeredMessage)
        {
            Dictionary<string, object> customProperties = new Dictionary<string, object>(brokeredMessage.Properties);
            Dictionary<string, object> predefinedProperties = new Dictionary<string, object>();

            foreach (var property in MessageProperties.SupportedGetProperties)
            {
                try
                {
                    var getProperty = MessageProperties.getBrokeredMessagePropertyFunctions[property];
                    predefinedProperties[property] = getProperty(brokeredMessage);
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
                MessageProperties.setBrokeredMessagePropertyActions[property.Key](message, property.Value);
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