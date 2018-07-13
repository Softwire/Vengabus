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
        return (
            <div>
                <QueueList />
                <ServiceBusConfigForm />
                <ExampleServiceBusCall onDataReceive={this.updateRetrievedData} />
                <ExampleServiceBusDataDisplay data={this.state.retrievedData} />
            </div>
        );
    }
}
