import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert, Tabs, Tab } from 'react-bootstrap';
import { JSONformatter } from './JSONformatter';
import { XMLformatter } from './XMLformatter';
import { OriginalFormatter } from './OriginalFormatter';
import _ from 'lodash';
import { sharedSizesAndDimensions } from '../../Helpers/SharedSizesAndDimensions';
import { Glyphicon } from 'react-bootstrap';
import { reactBoostrapDangerRedText, reactBoostrapDangerRedBackground, reactBoostrapWarningYellowText, reactBoostrapWarningYellowBackground } from '../../colourScheme';

export class FormattingBox extends Component {
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
        return this.alertBlock(
            "warning",
            key,
            `The formatter returned a warning whilst trying to format the text of this data:`,
            message,
            'See "Original Text" for the unformatted data.'
        );
    }

    noTextAlert(key) {
        return this.alertBlock("danger", key, "The formatter didn't return any text to display.");
    }

    alertBlock(alertType, key, ...messageLines) {
        const lines = messageLines.map((line, index) =>
            <p key={index}>{line}</p>
        );
        return (
            <Alert bsStyle={alertType} key={key} id={key}>
                {lines}
            </Alert >
        );
    }

    chooseDefaultFormat(formattedObjectArray) {
        //choose which tab in messageBox to default to
        const mostLikelyFormat = _.maxBy(formattedObjectArray, 'matchConfidence');
        return formattedObjectArray.indexOf(mostLikelyFormat);
    }

    getContentToDisplay(formattingAttemptResult) {
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
            const textStyle = formattingAttemptResult.formatType === 'Original' ? css`white-space: pre-wrap;` : ''; //wordwrap original text
            contentToDisplay.push(<pre key={formattingAttemptResult.formatType} className={textStyle} id={formattingAttemptResult.formatType}>{formattedText}</pre>);
        }
        if (contentToDisplay.length === 0) {
            formattingAttemptResult.errorMessage = "No text returned from the formatter"; //needed so that getFormatterTab recongises that this is indeed an error
            contentToDisplay.push(this.noTextAlert(formattingAttemptResult.formatType + "warning"));
        }
        return contentToDisplay;
    }

    getFormatterTab(formattingAttemptResult, tabKey) {
        const contentToDisplay = this.getContentToDisplay(formattingAttemptResult);
        let tabTitle = [formattingAttemptResult.formatType];
        let errorState;
        const glyphStyle = css`
            margin-left: 5px;
        `;
        if (formattingAttemptResult.errorMessage) {
            tabTitle.push(<Glyphicon glyph="exclamation-sign" key="errorGlyph" className={glyphStyle} />);
            errorState = "formatterError";
        } else if (formattingAttemptResult.warningMessage) {
            tabTitle.push(<Glyphicon glyph="warning-sign" key="warningGlyph" className={glyphStyle} />);
            errorState = "formatterWarning";
        }
        return <Tab title={tabTitle} eventKey={tabKey} key={tabKey} tabClassName={errorState}>{contentToDisplay}</ Tab>;
    }

    render() {
        const originalText = this.props.message;
        const formatters = [this.OriginalFormatter, this.XMLformatter, this.JSONformatter];
        const formattedObjects = formatters.map(formatter => formatter.getFormatResult(originalText));
        const messageTabsArray = formattedObjects.map((formattedObj, index) => this.getFormatterTab(formattedObj, index));
        const defaultTabToDisplay = this.chooseDefaultFormat(formattedObjects);

        const tabStyle = css`
            .nav-tabs {
                margin-bottom: 15px;
            }
            .tab-content {
                overflow: auto;
                max-height: calc(${sharedSizesAndDimensions.MESSAGEBOX_MODAL_HEIGHT}vh - 326px); /*326px is approximately the height of the MessageBox modal without FormattingBox*/

                pre {
                    margin-bottom: 0;
                }
            }
            .formatterError {
                a { /*colour the tab when there's an error*/
                    color: ${reactBoostrapDangerRedText};
                    background: ${reactBoostrapDangerRedBackground};
                }
                &.active>a {
                    &, &:focus, &:hover { /*need all these cases to override the default style*/
                        color: ${reactBoostrapDangerRedText};
                    }
                }
            }
            .formatterWarning {
                a { /*colour the tab when there's a warning*/
                    color: ${reactBoostrapWarningYellowText};
                    background: ${reactBoostrapWarningYellowBackground};
                }
                &.active>a {
                    &, &:focus, &:hover { /*need all these cases to override the default style*/
                        color: ${reactBoostrapWarningYellowText};
                    }
                }
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
