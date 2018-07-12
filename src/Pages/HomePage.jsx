import React, { Component } from 'react';
import { ServiceBusConfigForm } from '../Components/ServiceBusConfigForm';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';
import { ExampleServiceBusDataDisplay } from '../Components/ExampleServiceBusDataDisplay';

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
                <ServiceBusConfigForm />
                <ExampleServiceBusCall onDataReceive={this.updateRetrievedData} />
                <ExampleServiceBusDataDisplay data={this.state.retrievedData} />
            </div>
        );
    }
}
