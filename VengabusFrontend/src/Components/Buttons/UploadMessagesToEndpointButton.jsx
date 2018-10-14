import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { ReadMessagesFileButton } from './ReadMessagesFileButton';

const defaultState = {
    uploading: false,
    totalToSend: 0,
    totalSent: 0
};

export class UploadMessagesToEndpointButton extends Component {
    constructor(props) {
        super(props);
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        this.state = { ...defaultState };
    }

    sendAllMessages = (apiMessages) => {
        this.setState(oldState => ({
            uploading: true,
            totalToSend: oldState.totalToSend + apiMessages.length
        }));

        const allMessageSentPromises = [];
        apiMessages.forEach((message) => {
            const sentPromise = this.sendMessage(message);
            allMessageSentPromises.push(sentPromise);
        });

        Promise.all(allMessageSentPromises).then(() => {
            this.setState(oldState => {
                if (oldState.totalToSend === oldState.totalSent) {
                    return { ...defaultState };
                }
                return oldState;
            });
        });
    }

    sendMessage = (message) => {
        let messageSentPromise;

        if (this.props.endpointType === EndpointTypes.QUEUE) {
            messageSentPromise = this.serviceBusService.sendMessageToQueue(this.props.endpointName, message);
        } else {
            messageSentPromise = this.serviceBusService.sendMessageToTopic(this.props.endpointName, message);
        }

        const messageSentAndStateUpdateFired = messageSentPromise.then(() => {
            this.setState(oldState => ({ totalSent: (oldState.totalSent + 1) }));
        });

        return messageSentAndStateUpdateFired;
    }

    render() {
        const button = (
            <ReadMessagesFileButton
                disabled={false}
                onFileReadComplete={this.sendAllMessages}
                text={this.props.text}
            />
        );

        const loaded = 100 * (this.state.totalSent / this.state.totalToSend);

        const loading = this.state.uploading ? (
            <ProgressBar now={loaded} />
        ) : (null);

        let message;
        if (loaded === 100) {
            message = <p>Upload complete</p>;
        }
        return (
            <div>
                {button}
                {loading}
                {message}
            </div>
        );
    }
}