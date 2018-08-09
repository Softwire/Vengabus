import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert, Tabs, Tab } from 'react-bootstrap';
import { createFormattedJSONobject } from '../Helpers/JSONformatter';
import { createFormattedXMLobject } from '../Helpers/XMLformatter';


export class FormatBox extends Component {
    constructor(props) {
        super(props);
        this.isMessageTooLongToFormat = this.props.data.length > 100000;
    }

    startsAndEndsWith(inputString, startCharacter, endCharacter) {
        if (!inputString) {
            return false;
        }
        if (inputString[0] === startCharacter && inputString[inputString.length - 1] === endCharacter) {
            return true;
        }
        return false;
    }

    errorAlert(errorMessage) {
        return (
            <Alert bsStyle="danger">
                <p>{`The formatter threw an error whilst trying to format the text of this data: '${errorMessage}'`}</p>
            </Alert>
        );
    }

    identifyTextFormat(originalText) {
        if (this.startsAndEndsWith(originalText, '<', '>')) {
            var mightBeXML = true;
        }
        else if (this.startsAndEndsWith(originalText, '{', '}') || this.startsAndEndsWith(originalText, '[', ']')) {
            var mightBeJSON = true;
        }
        if (this.isMessageTooLongToFormat) {
            return 1;
        }
        if (mightBeJSON) {
            return 2;
        } else if (mightBeXML) {
            return 3;
        }
        return 1;
    }

    getContentToDisplay(formattedObject) {
        let contentToDisplay = [];
        let error = formattedObject.errorMessage;
        let warning = formattedObject.warningMessage;
        let formattedText = formattedObject.formattedText;
        if (error) {
            contentToDisplay.push(this.errorAlert(error));
        }
        if (warning) {
            contentToDisplay.push(this.errorAlert(warning));
        }
        if (formattedText) {
            contentToDisplay.push(<pre>{formattedText}</pre>);
        }
        if (contentToDisplay.length === 0) {
            contentToDisplay.push(<pre>The formatter didn't return any text to display.</pre>);
        }
        console.log(contentToDisplay);
        contentToDisplay.push(contentToDisplay.length > 0 ? '' : <pre>The formatter didn't return any text to display.</pre>);
        return contentToDisplay;
    }

    render() {
        const originalText = this.props.data;
        if (!this.isMessageTooLongToFormat) {
            var JSONobject = createFormattedJSONobject(originalText);
            var XMLobject = createFormattedXMLobject(originalText);
            var JSONdisplay = this.getContentToDisplay(JSONobject);
            var XMLdisplay = this.getContentToDisplay(XMLobject);

        } else {
            var longFormattingError = 'Long message: only messages under 100,000 characers in length are formatted.';
        }

        const formatOriginalText = css`
            text-align: left;
            white-space: pre-wrap;
        `;
        /*const xmlChangeAlert = (
            <Alert bsStyle="danger">
                <p>The XML formatter changed the text of this data. This was probably just to 'heal' malformed XML, but we can't be certain.</p>
                <p> See below for the original data text.</p >
            </Alert >
        );*/
        const alertStyle = css`
            .alert {
                margin-top: 20px;
            }

        `;
        const errorStyle = css`
            .tab-content {
                background-color: #f8eded
            }
        `;


        return (
            <div className={`${alertStyle} ${errorStyle}`}>
                <Tabs defaultActiveKey={this.identifyTextFormat(originalText)} id="message-formatting-tabs">
                    <Tab eventKey={1} title="Original Text">
                        <pre className={formatOriginalText}>{originalText}</pre>
                    </Tab>
                    <Tab eventKey={2} title="JSON">
                        {longFormattingError ? this.errorAlert(longFormattingError) : ''}
                        {JSONdisplay}
                    </Tab>
                    <Tab eventKey={3} title="XML">
                        {longFormattingError ? this.errorAlert(longFormattingError) : ''}
                        {XMLdisplay}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
