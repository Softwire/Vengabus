using System.Collections.Generic;

namespace VengabusAPI.Models
{
    public class VengaMessage
    {
        public VengaMessage(IDictionary<string,object> properties, string messageBody, string messageId, string contentType)
        {
            MessageProperties = properties;
            MessageBody = messageBody;
            MessageId = messageId;
            ContentType = contentType;
        }
        public IDictionary<string, object> MessageProperties { get; set; }
        public string MessageBody { get; set; }
        public string MessageId { get; set; }
        public string ContentType { get; set; }
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