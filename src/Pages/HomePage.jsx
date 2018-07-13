import React, { Component } from 'react';
import { ServiceBusConfigForm } from '../Components/ServiceBusConfigForm';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';
import { ExampleServiceBusDataDisplay } from '../Components/ExampleServiceBusDataDisplay';
import { QueueList } from '../Components/QueueList';

export class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = { retrievedData: "I haven't done a call yet." };
    }

    updateRetrievedData = (data) => {
        this.setState({ retrievedData: data });
    };

    render() {
        //const queueArray = this.props.queueArray;
        const queueArray = [
            { number: 1, name: 'q1', status: 'active' },
            { number: 2, name: 'q2', status: 'active' },
            { number: 3, name: 'q3', status: 'dead' }
        ];
        const queueList = <QueueList queueData={queueArray} />;

        return (
            <div>
                {queueList}
                <ServiceBusConfigForm />
                <ExampleServiceBusCall onDataReceive={this.updateRetrievedData} />
                <ExampleServiceBusDataDisplay data={this.state.retrievedData} />
            </div>
        );
    }
}
