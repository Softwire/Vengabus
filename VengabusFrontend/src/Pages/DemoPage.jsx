import React, { Component } from 'react';
import { MessageList } from '../Components/HomePage/MessageList';
import { css } from 'react-emotion';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { Button } from 'react-bootstrap';
import { PurgeMessagesButton } from '../Components/PurgeMessagesButton';
import { EndpointTypes } from '../Helpers/EndpointTypes';

export class DemoPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageData: [
                { uniqueId: "12f546de-481c-4ea5-aca5-e9559d0d8430", predefinedProperties: { messageId: "mal formatted xml 1" }, messageBody: "<a><shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { uniqueId: "a29bdf0c-18b2-425d-aa2e-0b0a1ded44f1", predefinedProperties: { messageId: "perfect XML" }, messageBody: "<a><b>sdfds</b><c>sdgsdg</c></a>" },
                { uniqueId: "0953cbc6-4ab5-41b5-98aa-0cfc9f1906f3", predefinedProperties: { messageId: "mal formatted xml 2" }, messageBody: "<a>{s}<hipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { uniqueId: "0aad93f1-8ad1-42cd-bac7-94768451a2d4", predefinedProperties: { messageId: "Error causing xml" }, messageBody: "<ashipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { uniqueId: "2d435573-25d0-4f9b-8481-bb83980766cf", predefinedProperties: { messageId: "Error causing xml 2" }, messageBody: "<shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>", type: "XML" },
                { uniqueId: "5e8e972d-7ff8-4da4-90fa-89993beb2513", predefinedProperties: { messageId: "good json" }, messageBody: `{"result":true , "count":42}` },
                { uniqueId: "4737a835-5716-4021-b368-95a7d8c1f2ba", predefinedProperties: { messageId: "bracket json" }, messageBody: `[true , 42]` },
                { uniqueId: "ae099ebb-1395-4165-a31a-bce13e8873c4", predefinedProperties: { messageId: "one long line" }, messageBody: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.` },
                { uniqueId: "a7163abc-1e9d-4427-bbae-fc3772957cde", predefinedProperties: { messageId: "one short line" }, messageBody: `Lorem ipsum dolor sit amet` },
                { uniqueId: "efeeb9ca-2284-416d-a977-a7cf831102a0", predefinedProperties: { messageId: "wide xml" }, messageBody: `<someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping>` },
                { uniqueId: "8c20068c-e65e-44ea-a51a-fb0ce290cce6", predefinedProperties: { messageId: "mal formatted wide xml" }, messageBody: `<someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping>` },
                { uniqueId: "216f8a13-ebce-4355-bb08-35a4ed3bd37e", predefinedProperties: { messageId: "wide json" }, messageBody: `{"result":true , "some numerical array":[234324,457,67869867,345435,324234,45765765,78756,435,2345]}` },
                { uniqueId: "5ff5c2f5-16ce-46c1-9913-b9c8ea5fde31", predefinedProperties: { messageId: "mal formatted wide json" }, messageBody: `{"result":true , "some numerical array":[234324,457,67869867,345435,324234,45765765,78756,435,2345]]}` },
                {
                    uniqueId: "2507923e-750a-4de0-8f09-4437b03c0d66",
                    predefinedProperties: { messageId: "text with newline characters" },
                    messageBody:
                        `Lorem ipsum dolor 
    sit amet Lorem ipsum dolor 
sit amet \nthat was a newline`
                },
                { uniqueId: "7da528ab-1095-475d-ae74-539c3a3c926d", predefinedProperties: { messageId: "long message under 100k" }, messageBody: `{ "theMessageBodyIs": "` + 'a'.repeat(99000) + `"}` },
                { uniqueId: "def7f260-c3ee-4975-b809-9aaabfd2001c", predefinedProperties: { messageId: "long message over 100k" }, messageBody: `{ "theMessageBodyIs": "` + 'a'.repeat(99976) + `"}` },
                {
                    uniqueId: "15",
                    customProperties: { favCol: "red", age: 19 },
                    messageBody: "hello world!jf",
                    predefinedProperties: { forcePersistence: false, messageId: "testingJF1", scheduledEnqueueTimeUtc: "0001-01-01T00:00:00Z", sequenceNumber: 45317471370415620, size: 173, state: "Active", timeToLive: "10675199.02:48:05.4775807" }
                },
                { uniqueId: "16", customProperties: { customProp: "testVal" }, messageBody: "", predefinedProperties: { messageId: "No body" } },
                { uniqueId: "17", predefinedProperties: { messageId: "XML with spaces" }, messageBody: "<a>      <b>                 sd  fds    </b><c>         sdgsdg    </c> </a>" },
                { uniqueId: "18", predefinedProperties: { messageId: "XML with newlines" }, messageBody: "<a>  \n    <b>      sd\nfds    </b>\n<c>    sdgsdg\n    </c> </a>" },
                { uniqueId: "19", predefinedProperties: { messageId: "JSON with spaces" }, messageBody: `{"          res  \t\tult        "      :     true           ,      "count":   "     te n       "  }` },
                { uniqueId: "20", predefinedProperties: { messageId: "JSON with newlines" }, messageBody: `\n{"\nresu\nlt":\ttrue \n , \n\n"count":\n42}\n\r` },
                {
                    uniqueId: "21",
                    customProperties: { customProp0: "value 0", customProp1: "value 1", customProp2: "value 2", customProp3: "value 3", customProp4: "value 4", customProp5: "value 5", customProp6: "value 6", customProp7: "value 7", customProp8: "value 8" },
                    messageBody: 'a'.repeat(2500),
                    predefinedProperties: { messageId: "messageBox scroll test" }
                },
            ]
        };
    }

    updateRetrievedData = (apiData) => {
        this.setState({ retrievedData: apiData });
    };


    handleListQueueMessages = (queueName) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const messagePromise = serviceBusService.listQueueMessages(queueName);
        messagePromise.then((result) => console.log(result));
    }

    handleListSubscriptionMessages = (topicName, subscriptionName) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const messagePromise = serviceBusService.listSubscriptionMessages(topicName, subscriptionName);
        messagePromise.then((result) => console.log(result));
    }


    render() {
        const queueDivStyle = css`
            width: 30%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;

        //qq remove hardcoded endpoint names later
        const queueName = 'ibdemoqueue';
        const topicName = 'ibdemotopic';
        const subscriptionName = 'sbu1';

        return (
            < div >
                <div className={queueDivStyle}>
                    <div id="demoMessageList">
                        <MessageList messageData={this.state.messageData}
                            showMessage={false}
                            endpointType={EndpointTypes.QUEUE}
                            messageType={EndpointTypes.MESSAGE}
                            endpointName={queueName}
                            handleClose={() => { }}
                            refreshMessageTableHandler={() => { }} />
                    </div>
                    {/*qq delete the text in Button once implemented properly*/}
                    <PurgeMessagesButton id="purgeQueueMessage" type={EndpointTypes.QUEUE} endpointName={queueName} />
                    <PurgeMessagesButton id="purgeTopicMessage" type={EndpointTypes.TOPIC} endpointName={topicName} />
                    <PurgeMessagesButton id="purgeSubscriptionMessage" type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />

                </div>

                <div>
                    <p>Displays other Page</p>
                    <Button onClick={() => this.handleListQueueMessages(queueName)}>
                        Display {queueName} messages
                </Button>
                    <Button onClick={() => this.handleListSubscriptionMessages(topicName, subscriptionName)}>
                        Display {subscriptionName} messages in topic {topicName}
                    </Button>
                </div>
            </div >
        );
    }
}
