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
