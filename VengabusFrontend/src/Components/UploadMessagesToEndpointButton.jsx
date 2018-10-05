import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { UploadMessageFileButton } from './UploadMessageFileButton';


export class UploadMessagesToEndpointButton extends Component {
    constructor(props) {
        super(props);
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        this.state = {
            uploading: false,
            totalToSend: 0,
            totalSent: 0
        };
    }

    sendMessage = (message) => {
        if (this.props.endpointType === EndpointTypes.QUEUE) {
            this.serviceBusService.sendMessageToQueue(this.props.endpointName, message).then(response => {
                this.setState(
                    {
                        totalSent: (this.state.totalSent + 1)
                    }
                );
            }
            );
        } else {
            this.serviceBusService.sendMessageToTopic(this.props.endpointName, message).then(response => {
                this.setState(
                    {
                        totalSent: (this.state.totalSent + 1)
                    }
                );
            }
            );
        }
    }

    sendAllMessages = (messagesLoadedPromise) => {
        messagesLoadedPromise.then(apiMessages => {
            this.setState({
                uploading: true,
                totalToSend: apiMessages.length + this.state.totalToSend
            }, () => {
                apiMessages.forEach(apiMessage => {
                    this.sendMessage(apiMessage);
                });
            });
        });
    }

    fileToObject = (file) => {
        return new Promise((resolve) => {
            const fileMessageObject = new FileReader();

            fileMessageObject.onload = (event) => {
                const message = JSON.parse(event.target.result);
                resolve(message);
            };

            fileMessageObject.readAsText(file.item(0));
        });
    }

    render() {
        const button = (
            <UploadMessageFileButton
                disabled={false}
                onUpload={this.sendAllMessages}
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