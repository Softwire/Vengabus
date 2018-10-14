import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { parseUploadedMessage } from '../../Helpers/FormattingHelpers';
import { FormControl, ControlLabel } from 'react-bootstrap';
import { vengaNotificationManager } from '../../Helpers/VengaNotificationManager';
import { ButtonWithInlineSpinner } from './ButtonWithInlineSpinner';

/**
 * @prop {Function<Promise<ApiMessages[]>>} onFileReadComplete function accepting a promise for the array of parsed messages in API format.
 * @prop {string} text Text for Upload button.
 * @prop {boolean} disabled Is button disabled.
 */
export class ReadMessagesFileButton extends Component {

    constructor(props) {
        super(props);
        this.state = { isSpinning: false };
    }

    /**
     * @param {browserFileUploadObject} file Expected to be the `event.target.files` value of a fileUploadInput Event.
     */
    uploadFile = (file) => {
        this.setState({ isSpinning: true });
        const filePromise = this.extractObjectFromFileUpload(file); //will be an Array of objects in the fileMessage format.
        const apiMessagesPromise = filePromise.then(jsonFileContents => {
            return jsonFileContents.map(fileMessage => parseUploadedMessage(fileMessage));
        }).catch(error => vengaNotificationManager.error("Upload Failed: " + error));

        apiMessagesPromise.then(() => { this.setState({ isSpinning: false }); });
        this.props.onFileReadComplete(apiMessagesPromise);
    }

    /**
     * @param {browserFileUploadObject} file Expected to be the `event.target.files` value of a fileUploadInput Event.
     * @returns {Promise<Object>} A Promise for fileUpload being complete. Returns the parsed JSON contents of the uploadedFile.
     */
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
        return (
            <ControlLabel htmlFor="fileUpload" style={{ cursor: "pointer" }}>
                {/*
                    You can't style a fileUpload input, so the only option is to
                    hide the real input, and display an unrelated div styled to
                    looks like a button in its place, and ensure that clicking
                    that button happens to trigger the input behaviour.

                    Humbug.
                */}
                <h3>
                    <ButtonWithInlineSpinner
                        disabled={this.props.disabled}
                        isSpinning={this.state.isSpinning}
                        componentClass="div"
                    >
                        {this.props.text}
                    </ButtonWithInlineSpinner>
                </h3>
                <FormControl
                    id="fileUpload"
                    type="file"
                    onChange={(event) => this.uploadFile(event.target.files)}
                    style={{ display: "none" }}
                />
            </ControlLabel>
        );
    }
}