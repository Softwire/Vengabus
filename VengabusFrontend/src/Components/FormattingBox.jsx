import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert } from 'react-bootstrap';
import formatJSon from 'prettyprint';
const formatXML = require("xml-formatter");
const classNames = require('classnames');


export class FormattingBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //for future use if other formats are supported and override is wanted
            isFormattable: true
        }
    }

    startsAndEndsWith = (inputString, startCharacter, endCharacter) => {
        if (inputString[0] === startCharacter && inputString[inputString.length - 1] === endCharacter) {
            return true;
        }
        return false;
    }

    render() {

        let formattedText;
        const originalData = this.props.data;
        let xmlFormattingSucceededButChangedText = false;
        let formattingError;
        let mightBeXml, mightBeJson;
        if (this.startsAndEndsWith(originalData, '<', '>')) {
            mightBeXml = true;
        }
        if (this.startsAndEndsWith(originalData, '{', '}') || this.startsAndEndsWith(originalData, '[', ']')) {
            mightBeJson = true;
        }


        //the XML library returns undefined for not XML meaning that format text will be falsely hence this working 
        if (this.state.isFormattable) {
            try {
                //check for xml first then check for json
                if (mightBeXml) {
                    formattedText = formatXML(originalData);
                    if (formattedText && (formattedText.replace(/\s/g, "") !== originalData)) {
                        xmlFormattingSucceededButChangedText = true;
                    }
                }
                if (!formattedText && mightBeJson) {
                    formattedText = formatJSon(JSON.parse(originalData));
                }
            }
            catch (err) {
                formattingError = err;
            }
        }
        const formatCss = css`
            text-align: left;
        `;
        const wordWrap = css`
            white-space: pre-wrap;
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
                <p>Original Data:</p>
                <pre id="originalText" className={formatOriginalText}>
                    {originalData}
                </pre>
            </div>
        )
        const boxContainingFormattedText = (
            <div id="formatted">
                <p>Formatted Data:</p>
                <pre id="formattedText" className={formatCss}>
                    {formattedText || originalData}
                </pre>
            </div>
        )

        return (
            <div >
                {xmlFormattingSucceededButChangedText ? xmlChangeAlert : ' '}
                {formattingError ? errorAlert : ' '}
                {formattedText ? boxContainingFormattedText : ''}
                {(!formattedText || xmlFormattingSucceededButChangedText) ? boxContainingOriginalText : ' '}
            </div>
        );
    }
}
