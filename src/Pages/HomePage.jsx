import React, { Component } from 'react';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';
import { QueueList } from '../Components/QueueList';
import { css } from 'react-emotion';

export class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrievedData: null,
            queueArray: null
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
                    <p> I got back: '{JSON.stringify(this.state.retrievedData)}' </p>
                    <QueueList queueData={this.state.retrievedData} />
                </div>
            </div>
        );
    }
}
