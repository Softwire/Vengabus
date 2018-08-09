import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert, Tabs, Tab } from 'react-bootstrap';
import formatJSon from 'prettyprint/dist/prettyPrintObject';
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



function removeBlankLines(text) {
    if (!text) {
        return text;
    }
    return text.replace(/^\s*\n/gm, "");
}

function matchWithoutWhitespace(text1, text2) {
    return text1.replace(/\s/g, "") === text2.replace(/\s/g, "");
}

export class FormatBox extends Component {

    constructor(props) {
        super(props);
        this.isMessageTooLongToFormat = this.props.data.length > 100000;
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

    render() {
        const originalText = this.props.data;
        let xmlFormattingSucceededButChangedText = false;
        if (!this.isMessageTooLongToFormat) {
            try {
                let deformattedOriginalText = removeWhitespaceFormattingFromXML(originalText);
                var XMLtext = removeBlankLines(formatXML(deformattedOriginalText));
                if (XMLtext && (!matchWithoutWhitespace(XMLtext, originalText))) {
                    xmlFormattingSucceededButChangedText = true;
                }
            }
            catch (err) {
                var XMLerror = err;
            }
            try {
                let deformattedOriginalText = removeWhitespaceFormattingFromJSON(originalText);
                var JSONtext = removeBlankLines(formatJSon(JSON.parse(deformattedOriginalText)));
            }
            catch (err) {
                var JSONerror = err;
            }
        } else {
            var longFormattingError = 'Long message: only messages under 100,000 characers in length are formatted.';
        }

        const formatOriginalText = css`
            text-align: left;
            white-space: pre-wrap;
        `;
        const xmlChangeAlert = (
            <Alert bsStyle="danger">
                <p>The XML formatter changed the text of this data. This was probably just to 'heal' malformed XML, but we can't be certain.</p>
                <p> See below for the original data text.</p >
            </Alert >
        );
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
                        {JSONerror ? this.errorAlert(JSONerror) : ''}
                        {JSONtext ? <pre>{JSONtext}</pre> : <pre>The formatter didn't return any text to display.</pre>}
                    </Tab>
                    <Tab eventKey={3} title="XML">
                        {longFormattingError ? this.errorAlert(longFormattingError) : ''}
                        {XMLerror ? this.errorAlert(XMLerror) : ''}
                        {xmlFormattingSucceededButChangedText ? xmlChangeAlert : ''}
                        {XMLtext ? <pre>{XMLtext}</pre> : <pre>The formatter didn't return any text to display.</pre>}
                    </Tab>
                </Tabs>
            </div>
        );
    }
}
