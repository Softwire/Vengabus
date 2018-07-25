import React, { Component } from 'react';
import { VengaServiceBusService } from '../AzureWrappers/VengaServiceBusService';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class DeleteQueueMessages extends Component {
    // delete all of the messages in the queue currently being viewes
    constructor(props) {
        super(props);
        this.state = {};
    }

    deleteQueueMessages = (queueName) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        //serviceBusService.deleteMessagesInQueue(queueName);
        serviceBusService.deleteMessagesInQueue(queueName).then((response) => console.log(response));
        console.log(queueName);
        console.log('hi')
        //console.log(serviceBusService.deleteMessagesInQueue(queueName));
    }


    render() {
        const queueName = this.props.queueName;

        return (
            < button onClick={this.deleteQueueMessages(queueName)} >Delete all messages in {queueName}</button >
        );
    }
}
