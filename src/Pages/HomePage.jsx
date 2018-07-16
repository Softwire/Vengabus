import React, { Component } from 'react';
import { ServiceBusConfigForm } from '../Components/ServiceBusConfigForm';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';
import { ExampleServiceBusDataDisplay } from '../Components/ExampleServiceBusDataDisplay';

export class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrievedData: null,
            queueArray: null
        };
    }

    // QQ
    // Implement function that retrieves data about queues
    updateQueues() {
        this.setState();
    }

    updateRetrievedData = (data) => {
        this.setState({ retrievedData: data });
    };

    render() {
        return (
            <div>
                <ServiceBusConfigForm />
                <ExampleServiceBusCall onDataReceive={this.updateRetrievedData} />
                {
                    // QQ
                    // Once the API is working we need to figureout how to best pass in data about the list of queues and topics
                    // For now it is assumed that everything is passed in in one object
                }
                <ExampleServiceBusDataDisplay data={this.state.retrievedData} />
            </div>
        );
    }
}
