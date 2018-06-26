import React, { Component } from 'react';

export default class ServiceBusConfigForm extends Component {
    
    render() {
        const parentState = this.props.parentState;
        const onInput = this.props.onChangeCallback;
        return (
            <div className="sb-config-form">
              <form>
                Connection String:<br/>
                <input type="text" name="connectionString" value = {parentState.connectionString} onChange={onInput}/><br/>
                Queue Name:<br/>
                <input type="text" name="queueName" value = {parentState.queueName} onChange={onInput}/>
              </form>
              <p>{parentState.connectionString}:{parentState.queueName}</p>
            </div>
          );
    }
}