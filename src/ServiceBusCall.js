import React, { Component } from 'react';
import promisifyCallBack from './promisifyCallBack';
let azure = require('azure-sb');

export default class ServiceBusCall extends Component {

    constructor(props){
        super(props);

        this.config = props.serviceBusConfig;
        this.state = { resultText: "I haven't done it yet."};

        var delayedPromise = new Promise(function(resolve, reject) {
            setTimeout(resolve, 3000, undefined/*Arg of resolve, passed to then*/);
        });
        delayedPromise.then((/*Arg of resolve, passed to then*/) => {
            this.setState({resultText: `ConnString = ${this.props.serviceBusConfig.connectionString}. Name = ${this.props.serviceBusConfig.queueName}`})
        });

        this.activeAzureServiceBusConnectionString = "";
        this.activeQueueName = "";
    }

    getData = () => {
        this.activeAzureServiceBusConnectionString = this.props.serviceBusConfig.connectionString;
        this.activeQueueName = this.props.serviceBusConfig.queueName;
        
        // Override settings to point at expected live target:
        // this.activeAzureServiceBusConnectionString = "Endpoint=sb://vengabusdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a8sPg0N79mgTNAfM57b7kwWsBCPK8TW7hwTwyexlK+8=";
        // this.activeQueueName = "DemoQueue1";

        // Further override settins to point at Rev.Proxy. target:
        // this.activeAzureServiceBusConnectionString = "Endpoint=sb://vengabusreverseproxy.azurewebsites.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a8sPg0N79mgTNAfM57b7kwWsBCPK8TW7hwTwyexlK+8=";
        // this.activeQueueName = "AzureApiProxy/" + this.activeQueueName;

        let serviceBusService = azure.createServiceBusService(this.activeAzureServiceBusConnectionString);
        let getQueuePromise = promisifyCallBack((callback) => serviceBusService.getQueue(this.activeQueueName, callback));
        
        getQueuePromise.then((queueResult)=>{
            console.log(queueResult);
            this.setState({
                settingsText: `ConnString = ${this.activeAzureServiceBusConnectionString}. Name = ${this.activeQueueName}`,
                retrievedData: JSON.stringify(queueResult)
            })
        });
    }
  
    render() {
        return (
            <div>
                <button onClick={this.getData}>Send Request</button>
                <p> I used config:'{this.state.settingsText}' </p>
                <p> I got back:'{this.state.retrievedData}' </p>
            </div>);
    }
}