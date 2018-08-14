import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert } from 'react-bootstrap';
import classNames from 'classnames';
import formatXML from 'xml-formatter';

function removeWhitespaceFormattingFromXML(originalData) {
    //remove any white space at the start of a line, as they will be added later in xml formatting.
    let noInitialWhitespace = originalData.replace(/^ */gm, "");

    //if original text is already formatted, there will be newlines between tags. Remove them as they will be added later.
    let noNewLinesAfterXMLTags = noInitialWhitespace.replace(/>[\n\r]/g, ">");
    let noNewLinesBeforeXMLTags = noNewLinesAfterXMLTags.replace(/[\n\r]</g, "<");

    //replace newlines and put things in the same line, as they will be added later. 
    //However, don't completely remove then as there might be genuine newlines in original text, so replace them by spaces.
    let replaceNewlineBySpaces = noNewLinesBeforeXMLTags.replace(/[\n\r]/g, " ");
    return replaceNewlineBySpaces;
}

function removeWhitespaceFormattingFromJSON(originalData) {
    //More or less the same as above
    let noInitialWhitespace = originalData.replace(/^ */gm, "");
    let noNewLinesAfterJSONTags = noInitialWhitespace.replace(/}[\n\r]/g, "}");
    let noNewLinesBeforeJSONTags = noNewLinesAfterJSONTags.replace(/[\n\r]{/g, "{");
    let replaceNewlineBySpaces = noNewLinesBeforeJSONTags.replace(/[\n\r]/g, " ");
    return replaceNewlineBySpaces;
}

function removeBlankLines(text) {
    if (!text) {
        return text;
    }
    return text.replace(/^\s*\n/gm, "");
}

function matchWithoutWhitespace(text1, text2) {
    return text1.replace(/\s/g, "") === text2.replace(/\s/g, "");
}

export class FormattingBox extends Component {

    constructor(props) {
        super(props);
        this.isMessageTooLongToFormat = this.props.data && (this.props.data.length > 100000);  //qqMDM data

    }

    startsAndEndsWith = (inputString, startCharacter, endCharacter) => {
        if (!inputString) {
            return false;
        }
        if (inputString[0] === startCharacter && inputString[inputString.length - 1] === endCharacter) {
            return true;
        }
        return false;
    }

    render() {

        let formattedText;
        const originalData = this.props.data; //qqMDM data

        let xmlFormattingSucceededButChangedText = false;
        let formattingError;
        let mightBeXml, mightBeJson;

        if (this.startsAndEndsWith(originalData, '<', '>')) {
            mightBeXml = true;
        }
        else if (this.startsAndEndsWith(originalData, '{', '}') || this.startsAndEndsWith(originalData, '[', ']')) {
            mightBeJson = true;
        }


        //the XML library returns undefined for not XML meaning that format text will be falsely hence this working 

        if (!this.isMessageTooLongToFormat) {
            try {
                //check for xml first then check for json
                if (mightBeXml) {
                    //first remove existing formatting
                    let deformattedOriginalText = removeWhitespaceFormattingFromXML(originalData);
                    //format it, but remove blank lines
                    formattedText = removeBlankLines(formatXML(deformattedOriginalText));
                    if (formattedText && (!matchWithoutWhitespace(formattedText, originalData))) {
                        xmlFormattingSucceededButChangedText = true;
                    }
                }
                if (mightBeJson) {
                    let deformattedOriginalText = removeWhitespaceFormattingFromJSON(originalData);
                    formattedText = removeBlankLines(JSON.stringify(JSON.parse(deformattedOriginalText), null, 4));
                }
            }
            catch (err) {
                formattingError = err;
            }
        } else {
            formattingError = 'Long message: only messages under 100,000 characers in length are formatted.';
        }
        const formatCss = css`
            text-align: left;
        `;
        const wordWrap = css`
            white-space: pre-wrap;
        `;
        const headerStyle = css`
            font-weight: bold;
            display: inline-block;
            margin-top: 0;
        `;
        const formatOriginalText = classNames(formatCss, wordWrap);
        const xmlChangeAlert = (
            <Alert bsStyle="danger">
                <p>The XML formatter changed the text of this data. This was probably just to 'heal' malformed XML, but we can't be certain.</p>
                <p> See below for the original data text.</p >
            </Alert >
        );
        const errorAlert = (
            <Alert bsStyle="danger">
                <p>{`The formatter threw an error whilst trying to format the text of this data: '${formattingError}'`}</p>
            </Alert>
        );
        const boxContainingOriginalText = (
            <div id="original">
                <h4 className={headerStyle}>Original Data:</h4>
                <pre id="originalText" className={formatOriginalText}>
                    {originalData}
                </pre>
            </div>
        )
        const boxContainingFormattedText = (
            <div id="formatted">
                <h4 className={headerStyle}>Formatted Data:</h4>
                <pre id="formattedText" className={formatCss}>
                    {formattedText || originalData}
                </pre>
            </div>
        )

        return (
            <div >
                {xmlFormattingSucceededButChangedText ? xmlChangeAlert : ''}
                {formattingError ? errorAlert : ''}
                {formattedText ? boxContainingFormattedText : ''}
                {(!formattedText || xmlFormattingSucceededButChangedText) ? boxContainingOriginalText : ''}
            </div>
        );
    }
}
