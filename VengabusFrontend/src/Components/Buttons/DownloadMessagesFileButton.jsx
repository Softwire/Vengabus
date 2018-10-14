import React, { Component } from 'react';
import { formatMessageForDownload, jsonToFormattedString } from '../../Helpers/FormattingHelpers';
import { ButtonWithInlineSpinner } from './ButtonWithInlineSpinner';
const downloadToFile = require("downloadjs");

/**
 * Downloads a message as a formatted JSON file. Does NOT download any null properties.
 * @prop {Function<Promise<Message[]>>} getMessages A function returning a promise to providing the messages to download.
 * @prop {string} downloadButtonText Text to render on the button.
 * @prop {string} fileName Filename for Download file.
 * @prop {string} id Set buttonElement id.
 * @prop {bool} disabled Is button disabled.
 */
export class DownloadMessagesFileButton extends Component {

    constructor(props) {
        super(props);
        this.state = { isSpinning: false };
    }

    downloadMessageFile = () => {
        this.setState({ isSpinning: true });
        this.props.getMessages().then(messages => {
            const endpointDownload = [];
            for (let i = 0; i < messages.length; i++) {
                endpointDownload.push(formatMessageForDownload(messages[i]));
            }
            const fileContents = jsonToFormattedString(endpointDownload);
            downloadToFile(fileContents, this.props.fileName + ".json", "text/json");
            this.setState({ isSpinning: false });
        });
    }

    render() {
        const showSpinner = this.state.isSpinning || this.props.isSpinning;

        return (
            <ButtonWithInlineSpinner
                isSpinning={showSpinner}
                disabled={this.props.disabled}
                id={this.props.id}
                onClick={this.downloadMessageFile}
            >
                {/* Space before the span is required for spacing of Download icon */}
                {this.props.downloadButtonText} <span className="glyphicon glyphicon-save" />
            </ButtonWithInlineSpinner>
        );
    }
}