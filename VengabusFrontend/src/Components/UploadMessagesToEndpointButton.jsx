import React, { Component } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import { parseUploadedMessage } from '../Helpers/FormattingHelpers';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { FormControl, ControlLabel } from 'react-bootstrap';


export class UploadMessagesToEndpointButton extends Component {
    constructor(props) {
        super(props);
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        this.state = {
            uploading: false,
            totalToSend: 0,
            totalSent: 0
        }
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

    handleClick = (file) => {
        if (this.props.isASingleFile) {
            this.props.replayMessage(this.fileToObject(file).then(data => parseUploadedMessage(data[0])));
        } else {
            this.fileToObject(file).then(data => this.sendArray(data));
        }
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

    sendArray = (data) => {
        this.setState({
            uploading: true,
            totalToSend: data.length + this.state.totalToSend
        }, () => {
            data.forEach(element => {
                this.sendMessage(parseUploadedMessage(element));
            });
        });
    }


    render() {

        const button = this.props.ready ? (
            <ControlLabel htmlFor="fileUpload" style={{ cursor: "pointer" }}><h3><div className=" btn btn-default">{this.props.text}</div></h3>
                <FormControl
                    id="fileUpload"
                    type="file"
                    onChange={(event) => this.handleClick(event.target.files)}
                    style={{ display: "none" }}
                />
            </ControlLabel>
        ) : (<Button disabled >{this.props.text}</Button>);

        const loaded = 100 * (this.state.totalSent / this.state.totalToSend);
        
        const loading = this.state.uploading ? (
            <ProgressBar now={loaded} />
        ) : (null);

        let message;
        if (loaded === 100) { 
            message = <p> Upload complete </p>;
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