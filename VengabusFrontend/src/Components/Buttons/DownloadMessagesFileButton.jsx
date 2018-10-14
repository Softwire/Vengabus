import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { formatMessageForDownload, jsonToFormattedString } from '../../Helpers/FormattingHelpers';
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

    downloadMessageFile = () => {
        this.props.getMessages().then(messages => {
            const endpointDownload = [];
            for (let i = 0; i < messages.length; i++) {
                endpointDownload.push(formatMessageForDownload(messages[i]));
            }
            const fileContents = jsonToFormattedString(endpointDownload);
            downloadToFile(fileContents, this.props.fileName + ".json", "text/json");
        });
    }

    render() {
        return (
            <Button disabled={this.props.disabled} id={this.props.id} onClick={this.downloadMessageFile}>
                {this.props.downloadButtonText} <span className="glyphicon glyphicon-save" /> {/* Space before is required for spacing */}
            </Button>
        );
    }
}