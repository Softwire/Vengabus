import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { formatMessageForDownload, jsonToFormattedString } from '../../Helpers/FormattingHelpers';
import { Spinner } from '../Spinner';
import { css } from 'emotion';
import classNames from 'classnames';
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
        const spinnerButtonStyling = css`
            height: 34px;
            width: 70px;
        `;
        const spinnerPlacement = css`
            margin: 0 0 8px 1px;
        `;
        const spinnerButton = (
            <Button id={this.props.id} bsClass={classNames('btn', 'btn-default', spinnerButtonStyling)}>
                <Spinner className={spinnerPlacement} size={10} />
             </Button>
        );
        const downloadButton = (
             <Button disabled={this.props.disabled} id={this.props.id} onClick={this.downloadMessageFile}>
                 {this.props.downloadButtonText} <span className="glyphicon glyphicon-save" /> {/* Space before is required for spacing */}
             </Button>
        );
        const useSpinner = this.state.isSpinning || this.props.isSpinning;

        return useSpinner ? spinnerButton : downloadButton;
    }
}