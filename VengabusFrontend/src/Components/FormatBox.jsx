import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert, Tabs, Tab } from 'react-bootstrap';
import { createFormattedJSONobject } from '../Helpers/JSONformatter';
import { createFormattedXMLobject } from '../Helpers/XMLformatter';
import { SSL_OP_CRYPTOPRO_TLSEXT_BUG } from 'constants';

export class FormatBox extends Component {
    constructor(props) {
        super(props);
        this.isMessageTooLongToFormat = this.props.message.length > 100000;
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

    formatterErrorAlert(message, key) {
        return this.alertBlock("danger", key, `The formatter threw an error whilst trying to format the text of this data:`, message);
    }

    formatterWarningAlert(message, key) {
        return this.alertBlock("warning", key, `The formatter returned a warning whilst trying to format the text of this data:`, message);
    }

    noTextAlert(key) {
        return this.alertBlock("danger", key, "The formatter didn't return any text to display.");
    }

    alertBlock(alertType, key, ...messageLines) {
        const lines = messageLines.map((line, index) =>
            <p key={index}>{line}</p>
        );
        return (
            <Alert bsStyle={alertType} key={key}>
                {lines}
            </Alert>
        );
    }

    identifyTextFormat(originalText, JSONerror, XMLerror) {
        //choose which tab in messageBox to default to
        if (this.isMessageTooLongToFormat) {
            return 1;
        }
        if (this.startsAndEndsWith(originalText, '{', '}') || this.startsAndEndsWith(originalText, '[', ']')) {
            if (!JSONerror) {
                //might be JSON
                return 2;
            }
        }
        if (this.startsAndEndsWith(originalText, '<', '>') && !XMLerror) {
            //might be XML
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
            contentToDisplay.push(this.formatterErrorAlert(error, formattedObject.formatType + "error"));
        }
        if (warning) {
            contentToDisplay.push(this.formatterWarningAlert(warning, formattedObject.formatType + "warning"));
        }
        if (formattedText) {
            contentToDisplay.push(<pre key={formattedObject.formatType}>{formattedText}</pre>);
        }
        if (contentToDisplay.length === 0) {
            contentToDisplay.push(this.noTextAlert(formattedObject.formatType + "warning"));
        }
        return contentToDisplay;
    }

    render() {
        const originalText = this.props.message;
        let JSONobject, XMLobject;
        if (!this.isMessageTooLongToFormat) {
            JSONobject = createFormattedJSONobject(originalText);
            XMLobject = createFormattedXMLobject(originalText);
        } else {
            var longFormattingError = 'Long message: only messages under 100,000 characters in length are formatted.';
            JSONobject = { errorMessage: longFormattingError };
            XMLobject = { errorMessage: longFormattingError };
        }
        const JSONdisplay = this.getContentToDisplay(JSONobject);
        const XMLdisplay = this.getContentToDisplay(XMLobject);
        const defaultTabToDisplay = this.identifyTextFormat(originalText, JSONobject.errorMessage, XMLobject.errorMessage);

        const formatOriginalText = css`
            text-align: left;
            white-space: pre-wrap;
        `;
        const tabStyle = css`
            .nav-tabs {
                margin-bottom: 20px;
            }
        `;

        return (
            <div>
                <Tabs animation={false} defaultActiveKey={defaultTabToDisplay} id="message-formatting-tabs" className={tabStyle}>
                    <Tab eventKey={1} title="Original Text">
                        <pre className={formatOriginalText}>{originalText}</pre>
                    </Tab>
                    <Tab eventKey={2} title="JSON">
                        {JSONdisplay}
                    </Tab>
                    <Tab eventKey={3} title="XML">
                        {XMLdisplay}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
