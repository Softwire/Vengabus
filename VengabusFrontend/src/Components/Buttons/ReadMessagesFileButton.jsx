import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { parseUploadedMessage } from '../../Helpers/FormattingHelpers';
import { FormControl, ControlLabel } from 'react-bootstrap';
import { vengaNotificationManager } from '../../Helpers/VengaNotificationManager';


export class ReadMessagesFileButton extends Component {
    uploadFile = (file) => {
        const filePromise = this.extractObjectFromFileUpload(file); //will be an Array of objects in the fileMessage format.
        const apiMessagesPromise = filePromise.then(jsonFileContents => {
            return jsonFileContents.map(fileMessage => parseUploadedMessage(fileMessage));
        }).catch(error => vengaNotificationManager.error("Upload Failed: " + error));

        apiMessagesPromise.then((apiMessages) => this.props.onFileReadComplete(apiMessages));
    }

    extractObjectFromFileUpload = (file) => {
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
        const disabledButton = (<Button disabled >{this.props.text}</Button>);
        const activeButton = (
            <ControlLabel htmlFor="fileUpload" style={{ cursor: "pointer" }}>
                {/*
                    You can't style a fileUpload input, so the only option is to
                    hide the real input, and display an unrelated div styled to
                    looks like a button in its place, and ensure that clicking
                    that button happens to trigger the input behaviour.

                    Humbug.
                */}
                <h3>
                    <div className=" btn btn-default">{this.props.text}</div>
                </h3>
                <FormControl
                    id="fileUpload"
                    type="file"
                    onChange={(event) => this.uploadFile(event.target.files)}
                    style={{ display: "none" }}
                />
            </ControlLabel>
        );

        return this.props.disabled ? disabledButton : activeButton;
    }
}