import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert } from 'react-bootstrap';
import prettyprint from 'prettyprint';
const formatXML = require("xml-formatter");


export class FormattingBox extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            //for future use if other formats are supported and override is wanted
            isFormattable: true
        }
    }

    render() {

        let formattedText;
        const originalData = this.props.data;
        let XMLFormattingSucceededButChangedText = false;
        let formattingError;

        //the XML library returns undefined for not XML meaning that format text will be falsely hence this working 
        if (this.state.isFormattable) {
            try {
                //check for xml first then check for json
                //prettyprint refers to json
                formattedText = formatXML(originalData);
                if (formattedText && (formattedText.replace(/\s/g, "") !== originalData)) {
                    XMLFormattingSucceededButChangedText = true;
                }
                if (!formattedText) {
                    formattedText = prettyprint(JSON.parse(originalData));
                }
            }
            catch (err) {
                formattingError = err;
            }
        }
        const formatCss = css`
            text-align: left;
        `;
        const changeAlert = (
            <Alert bsStyle="danger">
                <p>The XML formatter changed the text of this data. This was probably just to 'heal' mal-formed XML, but we can't be certain.</p>
                <p> See below for the original data text.</p >
            </Alert >
        );
        const errorAlert = (
            <Alert bsStyle="danger">
                <p>{`The formatter threw an error whilst trying to format the text of this data: '${formattingError}'`}</p>
            </Alert>
        );
        const boxContainingOriginalText = (
            <div>
                <p>Original Data:</p>
                <pre className={formatCss}>
                    {originalData}
                </pre>
            </div>
        )
        const boxContainingFormattedText = (
            <div>
                <p>Formatted Data:</p>
                <pre className={formatCss}>
                    {formattedText || originalData}
                </pre>
            </div>
        )

        return (
            <div >
                {XMLFormattingSucceededButChangedText ? changeAlert : ' '}
                {formattingError ? errorAlert : ' '}
                {formattedText ? boxContainingFormattedText : boxContainingOriginalText}
                {XMLFormattingSucceededButChangedText ? boxContainingOriginalText : ' '}
            </div>
        );
    }
}
