import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class ExampleServiceBusCall extends Component {
    constructor(props) {
        super(props);
        this.state = { settingsText: 'Settings not yet finalised' };
    }

    getData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        // QQ
        //The list of queues is just logged to the console at the moment
        //as an example to demonstrate it working.
        //This should be rendered properly once both the rendering code
        //and API endpoint have been completed.
        serviceBusService.listQueues().then((response) => console.log(response));
        serviceBusService
            .getAllQueues()
            .then((queueResult) => {
                const activeSettingsText = `ConnString = ${serviceBusConnection.activeServiceBusConString}. Name = ${serviceBusConnection.activeQueueName}`;
                this.setState({ settingsText: activeSettingsText });
                this.props.onDataReceive(queueResult);
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
