using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using System;

namespace VengabusAPI.Models
{
    public class VengaMessage
    {
        public Dictionary<string, object> CustomProperties { get; set; }
        public Dictionary<string, object> PredefinedProperties { get; set; }
        public string MessageBody { get; set; }

        private static Dictionary<string, Action<BrokeredMessage, object>> setBrokeredMessagePropertyActions =
        new Dictionary<string, Action<BrokeredMessage, object>>
        {
            {"ContentType", (message, value) => message.ContentType = (string) value },
            {"CorrelationId", (message, value) => message.CorrelationId = (string) value },
            {"ForcePersistence", (message, value) => message.ForcePersistence = (bool) value },
            {"Label", (message, value) => message.Label = (string) value },
            {"MessageId", (message, value) => message.MessageId = (string) value },
            {"PartitionKey", (message, value) => message.PartitionKey = (string) value },
            {"ReplyTo", (message, value) => message.ReplyTo = (string) value },
            {"ReplyToSessionId", (message, value) => message.ReplyToSessionId = (string) value },
            {"ScheduledEnqueueTimeUtc", (message, value) => message.ScheduledEnqueueTimeUtc = (DateTime) value },
            {"SessionId", (message, value) => message.SessionId = (string) value },
            {"TimeToLive", (message, value) => message.TimeToLive = (TimeSpan) value },
            {"To", (message, value) => message.To = (string) value },
            {"ViaPartitionKey", (message, value) => message.ViaPartitionKey = (string) value }
        };

        private static Dictionary<string, Func<BrokeredMessage, object>> getBrokeredMessagePropertyFunctions =
        new Dictionary<string, Func<BrokeredMessage, object>>
        {
            //Getters that can be set.
            {"ContentType", (message) => {return message.ContentType; } },
            {"CorrelationId", (message) => {return message.CorrelationId; } },
            {"ForcePersistence", (message) => {return message.ForcePersistence; } },
            {"Label", (message) => {return message.Label; } },
            {"MessageId", (message) => {return message.MessageId; } },
            {"PartitionKey", (message) => {return message.PartitionKey; } },
            {"ReplyTo", (message) => {return message.ReplyTo; } },
            {"ReplyToSessionId", (message) => {return message.ReplyToSessionId; } },
            {"ScheduledEnqueueTimeUtc", (message) => {return message.ScheduledEnqueueTimeUtc; } },
            {"SessionId", (message) => {return message.SessionId; } },
            {"TimeToLive", (message) => {return message.TimeToLive; } },
            {"To", (message) => {return message.To; } },
            {"ViaPartitionKey", (message) => {return message.ViaPartitionKey; } },
            //The properties below can only be get
            {"DeadLetterSource", (message) => {return message.DeadLetterSource; } },
            {"DeliveryCount", (message) => {return message.DeliveryCount; } },
            {"EnqueuedSequenceNumber", (message) => {return message.EnqueuedSequenceNumber; } },
            {"EnqueuedTimeUtc", (message) => {return message.EnqueuedTimeUtc; } },
            {"ExpiresAtUtc", (message) => {return message.ExpiresAtUtc; } },
            {"IsBodyConsumed", (message) => {return message.IsBodyConsumed; } },
            {"LockedUntilUtc", (message) => {return message.LockedUntilUtc; } }, 
            {"LockToken", (message) => {return message.LockToken; } },
            {"SequenceNumber", (message) => {return message.SequenceNumber; } },
            {"Size", (message) => {return message.Size; } },
            {"State", (message) => {return message.State; } }
        };

        public static IEnumerable<string> SupportedSetProperties => setBrokeredMessagePropertyActions.Keys;
        public static IEnumerable<string> SupportedGetProperties => getBrokeredMessagePropertyFunctions.Keys;

        public static VengaMessage FromBrokeredMessage(BrokeredMessage brokeredMessage)
        {
            Dictionary<string, object> customProperties = new Dictionary<string,object>(brokeredMessage.Properties);
            Dictionary<string, object> predefinedProperties = new Dictionary<string, object>();
            foreach (var property in SupportedGetProperties)
            {
                try
                {
                    predefinedProperties[property] = getBrokeredMessagePropertyFunctions[property](brokeredMessage);
                }
                catch (Exception e)
                {
                    predefinedProperties[property] = "Property unavailable: " + e.ToString();
                }
            }
            return new VengaMessage(customProperties, predefinedProperties, brokeredMessage.GetBody<string>());
        }

        public VengaMessage(Dictionary<string, object> customProperties, Dictionary<string, object> predefinedProperties, string messageBody)
        {
            CustomProperties = customProperties;
            PredefinedProperties = predefinedProperties;
            MessageBody = messageBody;
        }

        public BrokeredMessage ToBrokeredMessage()
        {
            var message = new BrokeredMessage();
            //set predefined properties
            foreach (var property in PredefinedProperties)
            {
                setBrokeredMessagePropertyActions[property.Key](message, property.Value);
            }
            //set user-defined properties
            foreach (var property in CustomProperties)
            {
                message.Properties.Add(property.Key, property.Value);
            }
            return message;
        }

    }
}

/*
the two dictionaries above are code-generated in c++.
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cstdio>

using namespace std;

typedef pair<string,string> ss;

vector<ss> properties_both;
vector<ss> properties_set;

int main() {
	
	printf("private static Dictionary <string, Action<BrokeredMessage, object>> setBrokeredMessagePropertyActions = \nnew Dictionary<string, Action<BrokeredMessage, object>>\n{\n");

	properties_set.push_back(make_pair("ContentType","string"));
	properties_set.push_back(make_pair("CorrelationId","string"));
	properties_set.push_back(make_pair("ForcePersistence","bool"));
	properties_set.push_back(make_pair("Label","string"));
	properties_set.push_back(make_pair("MessageId","string"));
	properties_set.push_back(make_pair("PartitionKey","string"));
	properties_set.push_back(make_pair("ReplyTo","string"));
	properties_set.push_back(make_pair("ReplyToSessionId","string"));
	properties_set.push_back(make_pair("ScheduledEnqueueTimeUtc","DateTime"));
	properties_set.push_back(make_pair("SessionId","string"));
	properties_set.push_back(make_pair("TimeToLive","TimeSpan"));
	properties_set.push_back(make_pair("To","string"));
	properties_set.push_back(make_pair("ViaPartitionKey","string"));

	properties_both = properties_set;
	properties_both.push_back(make_pair("DeadLetterSource", "string"));
	properties_both.push_back(make_pair("DeliveryCount", "string"));
	properties_both.push_back(make_pair("EnqueuedSequenceNumber", "string"));
	properties_both.push_back(make_pair("EnqueuedTimeUtc", "string"));
	properties_both.push_back(make_pair("ExpiresAtUtc", "string"));
	properties_both.push_back(make_pair("IsBodyConsumed", "string"));
	properties_both.push_back(make_pair("LockedUntilUtc", "string"));
	properties_both.push_back(make_pair("LockToken", "string"));
	properties_both.push_back(make_pair("SequenceNumber", "string"));
	properties_both.push_back(make_pair("Size", "string"));
	properties_both.push_back(make_pair("State", "string"));

	for (auto it = properties_set.begin();it != properties_set.end();it++) {
		if (it != properties_set.begin()) {
			printf(",\n");
		}
		printf("{\"%s\", (message, value) => message.%s = (%s) value }",it->first.c_str(),it->first.c_str(),it->second.c_str());
	}
	printf("\n};\n\n");

	printf("private static Dictionary<string, Func<BrokeredMessage, object>> getBrokeredMessagePropertyActions = \nnew Dictionary<string, Func<BrokeredMessage, object>>\n{\n");

	for (auto it = properties_both.begin();it != properties_both.end();it++) {
		if (it != properties_both.begin()) {
			printf(",\n");
		}
		printf("{\"%s\", (message) => {return message.%s; } }",it->first.c_str(),it->first.c_str());
	}
	printf("\n};\n\n");

	return 0;
}
*/
