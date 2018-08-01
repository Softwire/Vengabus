import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

export class OtherPage extends Component {
    handleListQueueMessages = (queueName) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const messagePromise = serviceBusService.listQueueMessages(queueName);
        messagePromise.then((result) => console.log(result.data));
    }

    handleListSubscriptionMessages = (topicName, subscriptionName) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const messagePromise = serviceBusService.listSubscriptionMessages(topicName, subscriptionName);
        messagePromise.then((result) => console.log(result.data));
    }

    render() {
        const queueName = 'demoqueue1';
        const topicName = 'demotopic1';
        const subscriptionName = 'demosubscription1';

        return (
            <div>
                <p>Displays other Page</p>
                <Button onClick={() => this.handleListQueueMessages(queueName)}>
                    Display {queueName} messages
                </Button>
                <Button onClick={() => this.handleListSubscriptionMessages(topicName, subscriptionName)}>
                    Display {subscriptionName} messages in topic {topicName}
                </Button>
            </div>

        );
    }
}
