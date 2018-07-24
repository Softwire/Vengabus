import React, { Component } from 'react';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';
import { QueueList } from '../Components/QueueList';
import { MessageList } from '../Components/MessageList';
import { css } from 'react-emotion';
import { Button } from 'react-bootstrap';

export class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrievedData: undefined,
            messageData: [{ messageId: 10, messageBody: "<shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>" }, { messageId: 11, messageBody: "banna" }]
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
        return (
            <div>
                <ExampleServiceBusCall onDataReceive={this.updateRetrievedData} />
                <div className={queueDivStyle}>
                    <QueueList queueData={this.state.retrievedData} />
                    <MessageList messageData={this.state.messageData} />
                </div>
            </div>
        );
    }
}
