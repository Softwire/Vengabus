import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class ExampleServiceBusCall extends Component {
    constructor(props) {
        super(props);
        this.state = { settingsText: 'Settings not yet finalised' };
    }

    getData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();

        serviceBusService
            .getQueue(serviceBusConnection.activeQueueName)
            .then((queueResult) => {
                const activeSettingsText = `ConnString = ${serviceBusConnection.activeServiceBusConString}. Name = ${serviceBusConnection.activeQueueName}`;
                this.setState({ settingsText: activeSettingsText });
                this.props.onDataReceive(queueResult);
            })
            .catch(console.log);

        serviceBusService
            .listQueues()
            .then((listqueueresult) => {
                const activeSettingsText = `ConnString = ${serviceBusConnection.activeServiceBusConString}. Name = ${serviceBusConnection.activeQueueName}`;
                this.setState({ settingsText: activeSettingsText });
                this.props.onDataReceive(listqueueresult);
            })
            .catch(console.log);
    };

    render() {
        return (
            <div>
                <button onClick={this.getData}>Send Request</button>
                <p>
                    I <em>actually</em> used config:'{this.state.settingsText}'
                </p>
            </div>
        );
    }
}
