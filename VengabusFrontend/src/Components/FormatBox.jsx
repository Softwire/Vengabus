import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert, Tabs, Tab } from 'react-bootstrap';
import { JSONformatter } from '../Helpers/JSONformatter';
import { XMLformatter } from '../Helpers/XMLformatter';
import { OriginalFormatter } from '../Helpers/OriginalFormatter';
import _ from 'lodash';

export class FormatBox extends Component {
    constructor(props) {
        super(props);
        this.JSONformatter = new JSONformatter();
        this.XMLformatter = new XMLformatter();
        this.OriginalFormatter = new OriginalFormatter();
    }

    formatterErrorAlert(message, key) {
        return this.alertBlock("danger", key, `The formatter threw an error whilst trying to format the text of this data:`, message);
    }

    formatterWarningAlert(message, key) {
        return this.alertBlock("warning", key, `The formatter returned a warning whilst trying to format the text of this data:`, message, 'See "Original Text" for the unformatted data.');
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

    identifyTextFormat(formattedObjectArray) {
        //choose which tab in messageBox to default to
        const mostLikelyFormat = _.maxBy(formattedObjectArray, 'matchConfidence');
        return formattedObjectArray.indexOf(mostLikelyFormat);
    }

    getContentToDisplay(formattingAttemptResult, key) {
        let contentToDisplay = [];
        const error = formattingAttemptResult.errorMessage;
        const warning = formattingAttemptResult.warningMessage;
        const formattedText = formattingAttemptResult.formattedText;
        if (error) {
            contentToDisplay.push(this.formatterErrorAlert(error, formattingAttemptResult.formatType + "error"));
        }
        if (warning) {
            contentToDisplay.push(this.formatterWarningAlert(warning, formattingAttemptResult.formatType + "warning"));
        }
        if (formattedText) {
            const textStyle = formattingAttemptResult.formatType === 'original' ? css`white-space: pre-wrap;` : ''; //wordwrap original text
            contentToDisplay.push(<pre key={formattingAttemptResult.formatType} className={textStyle}>{formattedText}</pre>);
        }
        if (contentToDisplay.length === 0) {
            contentToDisplay.push(this.noTextAlert(formattingAttemptResult.formatType + "warning"));
        }
        return <Tab title={formattingAttemptResult.formatType} eventKey={key} key={key}> {contentToDisplay}</ Tab>;
    }

    render() {
        const originalText = this.props.message;
        const formatters = [this.OriginalFormatter, this.XMLformatter, this.JSONformatter];
        const formattedObjectArray = formatters.map(formatter => formatter.getFormatResult(originalText));
        const messageTabsArray = formattedObjectArray.map((formattedObj, index) => this.getContentToDisplay(formattedObj, index));
        const defaultTabToDisplay = this.identifyTextFormat(formattedObjectArray);

        const tabStyle = css`
            .nav-tabs {
                margin-bottom: 20px;
            }
        `;

        return (
            <div>
                <Tabs animation={false} defaultActiveKey={defaultTabToDisplay} id="message-formatting-tabs" className={tabStyle}>
                    {messageTabsArray}
                </Tabs>
            </div>
        );
    }
}
