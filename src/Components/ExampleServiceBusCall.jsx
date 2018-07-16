import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class ExampleServiceBusCall extends Component {
    constructor(props) {
        super(props);
        this.state = { settingsText: 'Settings not yet finalised' };
    }

    getData = () => {
        /*
        const serviceBusService = serviceBusConnection.getServiceBusService();
        serviceBusService
            .getQueue(serviceBusConnection.activeQueueName)
            .then((queueResult) => {
                const activeSettingsText = `ConnString = ${serviceBusConnection.activeServiceBusConString}. Name = ${serviceBusConnection.activeQueueName}`;
                this.setState({ settingsText: activeSettingsText });
                this.props.onDataReceive(queueResult);
            })
            .catch(console.log);
        */
        // QQ
        // Hard coded for now, should be updated when the API is working
        const dataArray = [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }];
        this.props.onDataReceive(dataArray);
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
