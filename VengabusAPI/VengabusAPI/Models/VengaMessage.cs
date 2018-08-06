using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;

namespace VengabusAPI.Models
{
    public class VengaMessage
    {

        public VengaMessage(Dictionary<string, object> customProperties, Dictionary<string, object> predefinedProperties, string messageBody)
        {
            CustomProperties = customProperties;
            PredefinedProperties = predefinedProperties;
            MessageBody = messageBody;
        }

        public Dictionary<string, object> CustomProperties { get; set; }
        public Dictionary<string, object> PredefinedProperties { get; set; }
        public string MessageBody { get; set; }

        public static VengaMessage FromBrokeredMessage(BrokeredMessage brokeredMessage)
        {
            return VengaBrokeredMessageConverter.FromBrokeredMessage(brokeredMessage);
        }

        public BrokeredMessage ToBrokeredMessage()
        {
            return VengaBrokeredMessageConverter.ToBrokeredMessage(this);
        }

    }
}