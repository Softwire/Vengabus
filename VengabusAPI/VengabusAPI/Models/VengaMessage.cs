using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Models
{
    public class VengaMessage
    {
        public IDictionary<string, object> MessageProperties { get; set; }
        public string MessageBody { get; set; }
        public string MessageId { get; set; }
        public string ContentType { get; set; }
        public VengaMessage(IDictionary<string, object> properties, string messageBody, string messageId, string contentType)
        {
            MessageProperties = properties;
            MessageBody = messageBody;
            MessageId = messageId;
            ContentType = contentType;
        }
        public VengaMessage(BrokeredMessage brokeredMessage)
        {
            MessageProperties = brokeredMessage.Properties;
            MessageBody = brokeredMessage.GetBody<string>();
            MessageId = brokeredMessage.MessageId;
            ContentType = brokeredMessage.ContentType;
        }
        

        public BrokeredMessage ConvertToBrokeredMessage(VengaMessage vengaMessage)
        {
            var brokeredMessage = new BrokeredMessage(vengaMessage.MessageBody);
            brokeredMessage.MessageId = vengaMessage.MessageId;
            brokeredMessage.ContentType = vengaMessage.ContentType;
            foreach (var property in vengaMessage.MessageProperties)
            {
                brokeredMessage.Properties.Add(property.Key, property.Value);
            }
            return brokeredMessage;
        }
    }
}
/*
public class FixedMessagePropertiesMapper
{
    private Dictionary<string, Action<BrokeredMessage, object>> propertiesMap =
        new Dictionary<string, Action<BrokeredMessage, object>>
        {
            {"MessageId", (message, value) => message.MessageId = (string) value },
            {"ContentType", (message, value) => message.ContentType = (string) value }
        };

    public IEnumerable<string> SupportedProperties => propertiesMap.Keys;

    public void ApplyProperty(BrokeredMessage message, string propertyKey, object propertyValue)
    {

    }
}
*/