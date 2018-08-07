import React, { Component } from 'react';
import { QueueList } from '../Components/QueueList';
import { MessageList } from '../Components/MessageList';
import { css } from 'react-emotion';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { Glyphicon, Button } from 'react-bootstrap';
import { PAGES, pageSwitcher } from './PageSwitcherService';

export class DemoPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrievedData: [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }],
            messageData: [
                { predefinedProperties: { messageId: "mal formatted xml 1" }, messageBody: "<a><shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { predefinedProperties: { messageId: "perfect XML" }, messageBody: "<a><b>sdfds</b><c>sdgsdg</c></a>" },
                { predefinedProperties: { messageId: "mal formatted xml 2" }, messageBody: "<a>{s}<hipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { predefinedProperties: { messageId: "Error causing xml" }, messageBody: "<ashipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { predefinedProperties: { messageId: "Error causing xml 2" }, messageBody: "<shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>", type: "XML" },
                { predefinedProperties: { messageId: "good json" }, messageBody: `{"result":true , "count":42}`, },
                { predefinedProperties: { messageId: "bracket json" }, messageBody: `[true , 42]`, },
                { predefinedProperties: { messageId: "one long line" }, messageBody: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`, },
                { predefinedProperties: { messageId: "one short line" }, messageBody: `Lorem ipsum dolor sit amet`, },
                { predefinedProperties: { messageId: "wide xml" }, messageBody: `<someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping>`, },
                { predefinedProperties: { messageId: "mal formatted wide xml" }, messageBody: `<someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping><someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping></someModeratelyLongXMLtagForTheDemoPageToTestWordWrapping>`, },
                { predefinedProperties: { messageId: "wide json" }, messageBody: `{"result":true , "some numerical array":[234324,457,67869867,345435,324234,45765765,78756,435,2345]}`, },
                { predefinedProperties: { messageId: "mal formatted wide json" }, messageBody: `{"result":true , "some numerical array":[234324,457,67869867,345435,324234,45765765,78756,435,2345]]}`, },
                {
                    predefinedProperties: { messageId: "text with newline characters" },
                    messageBody:
                        `Lorem ipsum dolor 
    sit amet Lorem ipsum dolor 
sit amet \nthat was a newline`,
                },
            ]
        };
    }

    updateRetrievedData = (data) => {
        this.setState({ retrievedData: data });
    };


    handleListQueueMessages = (queueName) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const messagePromise = serviceBusService.listQueueMessages(queueName);
        messagePromise.then((result) => console.log(result.data));
    }

    handleListSubscriptionMessages = (topicName, subscriptionName) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const messagePromise = serviceBusService.listSubscriptionMessages(topicName, subscriptionName);
        messagePromise.then((result) => console.log(result.data));
    }


    render() {
        const queueDivStyle = css`
            width: 30%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;
        // Hard coded message to replay for now
        const exampleMessage = {
            customProperties: {
                userDefinedProp1: 'value1',
                userDefinedProp2: 'value2'
            },
            predefinedProperties: {
                MessageId: 'Message1',
                ContentType: 'null'
            },
            MessageBody: 'Hello world!'
        };

        //qq remove hardcoded endpoint names later
        const queueName = 'demoqueue1';
        const topicName = 'demotopic1';
        const subscriptionName = 'demosubscription1';
        const serviceBusService = serviceBusConnection.getServiceBusService();

        return (
            < div >
                <div className={queueDivStyle}>
                    <button onClick={() => pageSwitcher.switchToPage(PAGES.SendMessagePage, exampleMessage)}>Replay Example Message</button>
                    <QueueList queueData={this.state.retrievedData} />
                    <MessageList messageData={this.state.messageData} />
                    {/*qq delete the text in Button once implemented properly*/}
                    <Button onClick={() => serviceBusService.deleteQueueMessages(queueName)} bsStyle="danger">
                        Delete queue messages&#160;
                        <Glyphicon glyph="trash" />
                    </Button>
                    <Button onClick={() => serviceBusService.deleteTopicMessages(topicName)} bsStyle="danger">
                        Delete topic messages&#160;
                        <Glyphicon glyph="trash" />
                    </Button>
                    <Button onClick={() => serviceBusService.deleteSubscriptionMessages(topicName, subscriptionName)} bsStyle="danger">
                        Delete subcription messages&#160;
                        <Glyphicon glyph="trash" />
                    </Button>

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
