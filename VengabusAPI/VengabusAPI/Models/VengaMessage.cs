using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;
using VengabusAPI.Helpers;

namespace VengabusAPI.Models
{
    public class VengaMessage
    {

        public VengaMessage(Dictionary<string, object> customProperties, Dictionary<string, object> predefinedProperties, string messageBody, string uniqueId)
        {
            CustomProperties = customProperties;
            PredefinedProperties = predefinedProperties;
            MessageBody = messageBody;
            UniqueId = uniqueId;
        }

        public Dictionary<string, object> CustomProperties { get; set; }
        public Dictionary<string, object> PredefinedProperties { get; set; }
        public string UniqueId { get; set; } // format 6de22ba0-8ccc-e83f-456d-702cc19b44ae
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