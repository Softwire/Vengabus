import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { LOCAL_STORAGE_STRINGS } from './ConnectionStringConfigForm'


/**
 *    Local Storage is accessible as a global window when run in the browser.
 *    This variable exists mostly to be a holder for this comment! The global
 *    variable will be stubbed in by the jest-localstorage-mock package, during testing.
 */
const localStorageAccessor = localStorage;

export class ServiceBusConfigForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connectionString: '',
            queueName: ''
        };
    }

    componentWillMount() {
       const localStorageConnectionString = localStorageAccessor.getItem(LOCAL_STORAGE_STRINGS.ConnectionString) || '';
       this.updateConString(localStorageConnectionString);
    }

    updateFormAndConnection_ConString = (e, targetProperty) => {
        const newConString = e.target.value;
        this.updateConString(newConString);
    };

    updateConString = (newConString) => {
        this.setState({ connectionString: newConString });
        serviceBusConnection.setConnectionString(newConString);
        localStorageAccessor.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, newConString);
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
