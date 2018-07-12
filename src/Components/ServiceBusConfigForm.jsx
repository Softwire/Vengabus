import React, { Component } from 'react';

export class ServiceBusConfigForm extends Component {
    render() {
        const formCredentials = this.props.formCredentials;
        const updateFormStateOnInput = this.props.updateFormStateOnInput;

        return (
            <div className="sb-config-form">
                <form>
                    Connection String:
                    <input type="text" name="connectionString" value={formCredentials.connectionString} onChange={updateFormStateOnInput} />
                    <br />
                    Queue Name:
                    <input type="text" name="queueName" value={formCredentials.queueName} onChange={updateFormStateOnInput} />
                </form>
                <p>
                    Fields currently held in form: {formCredentials.connectionString} | {formCredentials.queueName}
                </p>
            </div>
        );
    }
}
