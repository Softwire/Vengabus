import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export const LOCAL_STORAGE_STRINGS = Object.freeze({
    ConnectionString: 'connectionString'
});

/**
 *    Local Storage is accessible as a global window when run in the browser.
 *    This variable exists mostly to be a holder for this comment! The global
 *    variable will be stubbed in by the jest-localstorage-mock package, during testing.
 */
const localStorageAccessor = localStorage;

export class ServiceBusConfigForm extends Component {
    constructor(props) {
        super(props);
        const localStorageConnectionString = localStorage.getItem(LOCAL_STORAGE_STRINGS.ConnectionString);

        this.state = {
            connectionString:localStorageConnectionString || '',
            queueName: ''
        };
    }

    updateFormAndConnection_ConString = (e, targetProperty) => {
        const newConString = e.target.value;
        this.setState({ connectionString: newConString });
        serviceBusConnection.setConnectionString(newConString);
        localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, newConString);
    };

    updateFormAndConnection_QueueName = (e, targetProperty) => {
        const newConString = e.target.value;
        this.setState({ queueName: newConString });
        serviceBusConnection.setQueueName(newConString);
    };

    render() {
        return (
            <div className="sb-config-form">
                <form>
                    Connection String:
                    <input
                        type="text"
                        id="connectionString"
                        name="connectionString"
                        value={this.state.connectionString}
                        onChange={this.updateFormAndConnection_ConString}
                    />
                    <br />
                    Queue Name:
                    <input type="text" id="queueName" name="queueName" value={this.state.queueName} onChange={this.updateFormAndConnection_QueueName} />
                </form>
                <p>
                    Fields currently held in form: {this.state.connectionString} | {this.state.queueName}
                </p>
            </div>
        );
    }
}
