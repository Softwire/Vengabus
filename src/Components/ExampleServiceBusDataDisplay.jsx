import React, { Component } from 'react';
import { QueueList } from '../Components/QueueList';

export class ExampleServiceBusDataDisplay extends Component {
    render() {
        return (
            <div>
                <p> I got back: '{JSON.stringify(this.props.data)}' </p>
                <QueueList queueData={this.props.data} />
            </div>
        );
    }
}
