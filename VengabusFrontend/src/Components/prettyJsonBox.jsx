// a component that just takes in some xml and returns it in a div

import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Alert } from 'react-bootstrap';

import prettyprint from 'prettyprint';


export class PrettyJsonBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //for future use if other formats are supported and override is wanted
            isJson: true
        }
    }

    render() {

        let formattedText;
        const originalData = this.props.data;
        let formattingSucceededButChangedText = false;
        let formattingError;

        //the Json library returns undefined for not XML meaning that format text will be falsely hence this working
        console.log(originalData)
        if (this.state.isJson) {
            try {
                formattedText = prettyprint(JSON.parse(originalData));
                // if (formattedText && (formattedText.replace(/\s/g, "") !== originalData)) {
                //   formattingSucceededButChangedText = true;
                //}
                console.log(formattedText)
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
                <p>The JSON formatter changed the text of this data. This was probably just to 'heal' mal-formed JSON, but we can't be certain.</p>
                <p> See below for the original data text.</p >
            </Alert >
        );
        const errorAlert = (
            <Alert bsStyle="danger">
                <p>{`The JSON formatter threw an error whilst trying to format the text of this data: '${formattingError}'`}</p>
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
                {formattingSucceededButChangedText ? changeAlert : ' '}
                {formattingError ? errorAlert : ' '}
                {formattedText ? boxContainingFormattedText : boxContainingOriginalText}
                {formattingSucceededButChangedText ? boxContainingOriginalText : ' '}
            </div>
        );
    }
}
