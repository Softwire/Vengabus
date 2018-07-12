import React, { Component } from 'react';
import { ServiceBusConfigForm } from '../Components/ServiceBusConfigForm';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';

export class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connectionString: '',
            queueName: ''
        };
    }

    updateStateOnInput = (e, targetProperty) => {
        var mutation = {};
        mutation[e.target.name] = e.target.value;
        this.setState(mutation);
    };

    render() {
        return (
            <div>
                <ServiceBusConfigForm formCredentials={this.state} updateFormStateOnInput={this.updateStateOnInput} />
                <ExampleServiceBusCall serviceBusConfig={this.state} />
            </div>
        );
    }
}
