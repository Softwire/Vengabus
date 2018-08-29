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

        this.formatters = [
            new OriginalFormatter(),
            new XMLformatter(),
            new JSONformatter()
        ];
        /*
            A formatter needs to be an object, with a getFormatResult(originalText) method.
            That method should return the following object: 
            {
                formatType: (text) (REQUIRED) Name text to put on tab.
                formattedText: (text) (REQUIRED) The string to display in the <pre> tag, with all the appropriate whitespacing added.
                matchConfidence: (float in [0.0, 1.0]) (REQUIRED) Indicates how confident the formatter is that the input text was of 'its' format.
                preTagClassName: (text) (OPTIONAL) Any className that should be applied to the <pre> tag containing the formatted text, e.g. to style it.
                errorMessage: (text) (OPTIONAL) Error test to display (makes tab red)
                warningMessage: (text) (OPTIONAL) Warning test to display (makes tab yellow)
            }

         */
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
            const preTag = (
                <pre
                    key={formattingAttemptResult.formatType}
                    id={formattingAttemptResult.formatType}
                    className={formattingAttemptResult.preTagClassName || ''}
                >
                    {formattedText}
                </pre>
            );
            contentToDisplay.push(preTag);
        }
        if (contentToDisplay.length === 0) {
            formattingAttemptResult.errorMessage = "No text returned from the formatter"; //needed so that getFormatterTab recongises that this is indeed an error
            contentToDisplay.push(this.noTextAlert(formattingAttemptResult.formatType + "error"));
        }
        return contentToDisplay;
    }

    getFormatterTab(formattingAttemptResult, tabKey) {
        const contentToDisplay = this.getContentToDisplay(formattingAttemptResult);
        let tabTitle = [formattingAttemptResult.formatType];
        let errorState;
        const glyphStyle = css`margin-left: 5px;`;
        
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
        const originalText = this.props.message || '';
        const formattedObjects = this.formatters.map(formatter => formatter.getFormatResult(originalText));
        const messageTabsArray = formattedObjects.map((formattedObj, index) => this.getFormatterTab(formattedObj, index));
        const defaultTabToDisplay = this.chooseDefaultFormat(formattedObjects);

        const tabStyle = css`
            .nav-tabs {
                margin-bottom: 15px;
            }
            .tab-content {
                pre {
                    margin-bottom: 0;
                    overflow: auto;     /*We need to have this styled here, so that BOTH axes get sensible scroll bars.*/
                    max-height: calc(${sharedSizesAndDimensions.MESSAGEBOX_MODAL_HEIGHT}vh - 326px); /*326px is approximately the height of the MessageBox modal without FormattingBox*/
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
