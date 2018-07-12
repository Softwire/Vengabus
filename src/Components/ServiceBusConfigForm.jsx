import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class ServiceBusConfigForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connectionString: '',
            queueName: ''
        };
    }

    updateFormAndConnection_ConString = (e, targetProperty) => {
        var newConString = e.target.value;
        this.setState({ connectionString: newConString });
        serviceBusConnection.setConnectionString(newConString);
    };

    updateFormAndConnection_QueueName = (e, targetProperty) => {
        var newConString = e.target.value;
        this.setState({ queueName: newConString });
        serviceBusConnection.setQueueName(newConString);
    };

    render() {
        return (
            <div className="sb-config-form">
                <form>
                    Connection String:
                    <input type="text" name="connectionString" value={this.state.connectionString} onChange={this.updateFormAndConnection_ConString} />
                    <br />
                    Queue Name:
                    <input type="text" name="queueName" value={this.state.queueName} onChange={this.updateFormAndConnection_QueueName} />
                </form>
                <p>
                    Fields currently held in form: {this.state.connectionString} | {this.state.queueName}
                </p>
            </div>
        );
    }
}
