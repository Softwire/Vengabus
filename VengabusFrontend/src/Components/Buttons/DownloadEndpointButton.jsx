import React, { Component } from 'react';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { DownloadMessagesFileButton } from './DownloadMessagesFileButton';
import moment from 'moment';

/**
 * @prop {string} endpointName The name of the endpoint to be downloaded.
 * @prop {EndpointTypes} endpointType The type of the endpoint to be downloaded. Only queues and subscriptions are supported.
 * @prop {string} parentTopic The parent topic of the subscription to be downloaded. Only required for subscriptions.
 */
export class DownloadEndpointButton extends Component {

    /**
     * @returns {Function<Promise<Message[]>>} returns a Promise for the Endpoint Messages
     */
    getEndpointMessages = () => {
        let getMessagesPromise;
        switch (this.props.endpointType) {
            case EndpointTypes.QUEUE:
                getMessagesPromise = serviceBusConnection.getServiceBusService().listQueueMessages(this.props.endpointName);
                break;
            case EndpointTypes.SUBSCRIPTION:
                if (!this.props.parentTopic) { throw new Error('For subscriptions, the parent topic must be defined'); }
                getMessagesPromise = serviceBusConnection.getServiceBusService().listSubscriptionMessages(this.props.parentTopic, this.props.endpointName);
                break;
            default:
                throw new Error('Unexpected endpoint type: ' + this.props.endpointType);
        }
        return getMessagesPromise;
    }

    render() {
        return (
            <DownloadMessagesFileButton
                getMessages={this.getEndpointMessages}
                downloadButtonText={'Download ' + this.props.endpointType}
                fileName={this.props.endpointName + moment().format('_YYYY-MM-DD_HH-mm-ss')}
            />
        );
    }
}