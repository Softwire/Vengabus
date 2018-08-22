import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import { formatMessageForDownload } from '../Helpers/FormattingHelpers';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
const download = require("downloadjs");

/**
 * @prop {string} endpointName The name of the endpoint to be downloaded.
 * @prop {EndpointTypes} endpointType The type of the endpoint to be downloaded. Only queues and subscriptions are supported.
 * @prop {string} parentTopic The parent topic of the subscription to be downloaded. Only required for subscriptions.
 */
export class DownloadEndpointButton extends Component {

    downloadEndpoint = () => {
        let promise;
        switch (this.props.endpointType) {
            case EndpointTypes.QUEUE:
                promise = serviceBusConnection.getServiceBusService().listQueueMessages(this.props.endpointName);
                break;
            case EndpointTypes.SUBSCRIPTION:
                if (!this.props.parentTopic) { throw new Error('for subscriptions parent topic must be defined'); }
                promise = serviceBusConnection.getServiceBusService().listSubscriptionMessages(this.props.parentTopic, this.props.endpointName);
                break;
            default:
                throw new Error('Unexpected endpoint type: ' + this.props.endpointType);
        }
        promise.then(messages => {
            let endpointDownload = [];
            for (let i = 0; i < messages.length; i++) {
                endpointDownload.push(formatMessageForDownload(messages[i]));
            }
            download(JSON.stringify(endpointDownload, 0, 4), this.props.endpointName + ".json", "text / json");
        });
    }

    render() {
        if (!this.props.endpointName) {
            throw new Error('enpointName is a required prop');
        }
        return (
            <Button onClick={this.downloadEndpoint}>Download {this.props.endpointType}</Button>
        );
    }
}