import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class ExampleServiceBusCall extends Component {
    constructor(props) {
        super(props);

        this.state = { retrievedData: "I haven't done it yet." };
    }

    getData = () => {
        /* In reality, we would probably want to form sending this info to the Connection object directly. But for the sake of demonstration...*/
        serviceBusConnection.setConnectionString(this.props.serviceBusConfig.connectionString);
        serviceBusConnection.setQueueName(this.props.serviceBusConfig.queueName);

        let serviceBusService = serviceBusConnection.getServiceBusService();

        serviceBusService
            .getQueue(serviceBusConnection.activeQueueName)
            .then((queueResult) => {
                let activeSettingsText = `ConnString = ${serviceBusConnection.activeServiceBusConString}. Name = ${serviceBusConnection.activeQueueName}`;
                this.setState({
                    settingsText: activeSettingsText,
                    retrievedData: JSON.stringify(queueResult)
                });
            })
            .catch(console.log);
    };

    render() {
        return (
            <div>
                <button onClick={this.getData}>Send Request</button>
                <p> I used config:'{this.state.settingsText}' </p>
                <p> I got back:'{this.state.retrievedData}' </p>
            </div>
        );
    }
}
