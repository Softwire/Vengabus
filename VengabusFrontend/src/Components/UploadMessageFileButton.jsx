import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { parseUploadedMessage } from '../Helpers/FormattingHelpers';
import { FormControl, ControlLabel } from 'react-bootstrap';


export class UploadMessageFileButton extends Component {
    uploadFile = (file) => {
        const filePromise = this.fileToObject(file); //will be an Array of objects in the fileMessage format.
        const apiMessages = filePromise.then(jsonFileContents => {
            return jsonFileContents.map(fileMessage => parseUploadedMessage(fileMessage))
        });
        this.props.onUpload(apiMessages);
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
        const disabledButton = (<Button disabled >{this.props.text}</Button>);
        const activeButton = (
            <ControlLabel htmlFor="fileUpload" style={{ cursor: "pointer" }}><h3><div className=" btn btn-default">{this.props.text}</div></h3>
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