import React, { Component } from 'react';
import { QueueList } from '../Components/QueueList';
import { MessageList } from '../Components/MessageList';
import { css } from 'react-emotion';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { Button } from 'react-bootstrap';
import { PAGES, pageSwitcher } from './PageSwitcherService';
import { DeleteMessagesButton } from '../Components/DeleteMessagesButton';
import { EndpointTypes } from '../Helpers/EndpointTypes';

export class DemoPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrievedData: [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }],
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
                { uniqueId: "16", customProperties: { customProp: "testVal" }, messageBody: "", predefinedProperties: { messageId: "No body" } }

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
        // Hard coded message to replay for now
        const exampleMessage = {
            message: {
                customProperties: {
                    userDefinedProp1: 'value1',
                    userDefinedProp2: 'value2'
                },
                predefinedProperties: {
                    MessageId: 'Message1',
                    ContentType: 'null'
                },
                messageBody: 'Hello world!'
            },
            recipientIsQueue: true,
            selectedQueue: 'demoqueue1'
        };

        //qq remove hardcoded endpoint names later
        const queueName = 'demoqueue1';
        const topicName = 'demotopic1';
        const subscriptionName = 'demosubscription1';

        return (
            < div >
                <div className={queueDivStyle}>
                    <button onClick={() => pageSwitcher.switchToPage(PAGES.SendMessagePage, exampleMessage)}>Replay Example Message</button>
                    <QueueList queueData={this.state.retrievedData} />
                    <MessageList messageData={this.state.messageData} />
                    {/*qq delete the text in Button once implemented properly*/}
                    <DeleteMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />
                    <DeleteMessagesButton type={EndpointTypes.TOPIC} endpointName={topicName} />
                    <DeleteMessagesButton type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />

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
