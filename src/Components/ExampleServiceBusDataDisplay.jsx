import React, { Component } from 'react';
import { QueueList } from '../Components/QueueList';
import { css } from 'react-emotion';

export class ExampleServiceBusDataDisplay extends Component {
    render() {
        const queueDivStyle = css`
            width: 30%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;
        return (
            <div className={queueDivStyle}>
                <p> I got back: '{JSON.stringify(this.props.data)}' </p>
                <QueueList queueData={this.props.data} />
            </div>
        );
    }
}
