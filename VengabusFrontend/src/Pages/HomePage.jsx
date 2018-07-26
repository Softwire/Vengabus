import React, { Component } from 'react';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';
import { QueueList } from '../Components/QueueList';
import { MessageList } from '../Components/MessageList';
import { css } from 'react-emotion';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrievedData: undefined,
            messageData: [
                { messageId: 10, messageBody: "<a><shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>" },
                { messageId: 11, messageBody: "<a><b>sdfds</b><c>sdgsdg</c></a>" },
                { messageId: 12, messageBody: "<a>{s}<hipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>" },
                { messageId: 13, messageBody: "<ashipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>" },
                { messageId: 14, messageBody: "<shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>" },
                { messageId: 15, messageBody: "<a><shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>" },
            ]
        };
    }

    updateRetrievedData = (data) => {
        this.setState({ retrievedData: data });
    };


    render() {
        const queueDivStyle = css`
            width: 30%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;

        //qq remove hardcoded endpoint names later
        const queueName = 'demoqueue1';
        const topicName = 'demotopic1';
        const subscriptionName = 'demosubscription1';
        const serviceBusService = serviceBusConnection.getServiceBusService();
        return (
            < div >
                <ExampleServiceBusCall onDataReceive={this.updateRetrievedData} />
                <div className={queueDivStyle}>
                    <QueueList queueData={this.state.retrievedData} />
                    <MessageList messageData={this.state.messageData} />
                    <button onClick={() => serviceBusService.deleteQueueMessages(queueName)} >Delete queue messages &#128465;</button >
                    <button onClick={() => serviceBusService.deleteTopicMessages(topicName)} >Delete topic messages &#128465;</button >
                    <button onClick={() => serviceBusService.deleteSubscriptionMessages(topicName, subscriptionName)} >Delete subcription messages &#128465;</button >

                </div>
            </div >
        );
    }
}
