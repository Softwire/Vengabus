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

        public static VengaMessage FromBrokeredMessage(BrokeredMessage brokeredMessage)
        {
            return new VengaMessage(brokeredMessage.Properties, brokeredMessage.GetBody<string>(), brokeredMessage.MessageId, brokeredMessage.ContentType);
        }

       public VengaMessage(IDictionary<string, object> properties, string messageBody, string messageId, string contentType)
        {
            MessageProperties = properties;
            MessageBody = messageBody;
            MessageId = messageId;
            ContentType = contentType;
        }

        public BrokeredMessage ToBrokeredMessage()
        {
            var message = new BrokeredMessage(MessageBody)
            {
                MessageId = MessageId,
                ContentType = ContentType
            };
            foreach (var property in MessageProperties)
            {
                message.Properties.Add(property.Key, property.Value);
            }
            return message;
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