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