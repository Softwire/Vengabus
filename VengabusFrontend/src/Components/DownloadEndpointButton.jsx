import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import { formatMessageForDownload, jsonToString} from '../Helpers/FormattingHelpers';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
const download = require("downloadjs");

/**
 * @prop {string} endpointName The name of the endpoint to be downloaded.
 * @prop {EndpointTypes} endpointType The type of the endpoint to be downloaded. Only queues and subscriptions are supported.
 * @prop {string} parentTopic The parent topic of the subscription to be downloaded. Only required for subscriptions.
 */
export class DownloadEndpointButton extends Component {

    downloadEndpoint = () => {
        let getMessagesPromise;
        switch (this.props.endpointType) {
            case EndpointTypes.QUEUE:
                getMessagesPromise = serviceBusConnection.getServiceBusService().listQueueMessages(this.props.endpointName);
                break;
            case EndpointTypes.SUBSCRIPTION:
                if (!this.props.parentTopic) { throw new Error('for subscriptions parent topic must be defined'); }
                getMessagesPromise = serviceBusConnection.getServiceBusService().listSubscriptionMessages(this.props.parentTopic, this.props.endpointName);
                break;
            default:
                throw new Error('Unexpected endpoint type: ' + this.props.endpointType);
        }
        getMessagesPromise.then(messages => {
            const endpointDownload = [];
            for (let i = 0; i < messages.length; i++) {
                endpointDownload.push(formatMessageForDownload(messages[i]));
            }
            download(jsonToString(endpointDownload), this.props.endpointName + ".json", "text / json");
        });
    }

    render() {
        return (
            <Button onClick={this.downloadEndpoint}>Download {this.props.endpointType} <span className="glyphicon glyphicon-save" /></Button>
        );
    }
}