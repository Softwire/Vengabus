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
        /*
            The CSS here is a bit tricky.
            We have 2 possible texts: the "Download Foo (icon)" text, and the Spinner text.
            
            We want the button to be as big as necessary to contain the long download text. That means it can't have fixed width.
            We want the button to have the same width when we create the spinner, though.
            
            Current solution is to have both download and spinner present the whole time, but rendered on top of one another,
            with one marked visibility: 'hidden'. That way the larger text will always keep the button large.

            visibility:'hidden' is easy; rendering them on top of one another is harder.
            Traditional approach is to use position: absolute, but then the long text doesn't make the button big.
            So instead, we'll float both pieces of text, render the spinner first (because it is a predictable width)
            And give the download text a negative margin to compensate for the space taken up by the spinner.

            We would love for the spinner to be centred in the button, but I couldn't figure out how to do that.
            The traditional approach (margin: 0 auto) doesn't work with a floating element.
            And all other hacks I could find had similar inconsistencies.
         */
        const useSpinner = this.state.isSpinning || this.props.isSpinning;

        const spinnerPlacement = css`
            margin: 0 0 8px 1px;
        `;
        const hidden = css`
            visibility: hidden;
        `;

        const coLocateSpinner = css`float:left;`;
        const coLocateDownloadText = css`
            float:left;
            margin-left: -11px; /*This is the width of the spinner element, and is needed to get the two elements to start at the same point.*/
        `;

        const spinnerContents = (
            <div className={classNames(coLocateSpinner, { [hidden]: !useSpinner })} >
                < Spinner className={spinnerPlacement} size={10} />
            </div >
        );
        const downloadContents = (
            <div className={classNames(coLocateDownloadText, { [hidden]: useSpinner })} >
                {/* Space before the span is required for spacing of Download icon */}
                {this.props.downloadButtonText} <span className="glyphicon glyphicon-save" />
            </div>
        );
        console.log(hidden);
        return (
            <Button
                disabled={this.props.disabled || useSpinner}
                id={this.props.id}
                onClick={this.downloadMessageFile}
            >
                {spinnerContents}
                {downloadContents}
            </Button>
        );
    }
}