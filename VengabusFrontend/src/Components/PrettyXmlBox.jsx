// a component that just takes in some xml and returns it in a div

import React, { Component } from 'react';
import { css } from 'react-emotion';
const format = require("xml-formatter");

export class PrettyXMLBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isXMl: true
        }
    }

    render() {

        let formattedText;
        //the XML library returns undefined for not XML meaning that format text will be falsely hence this working 
        if (this.state.isXMl) {
            formattedText = format(this.props.xml);
        }
        const formatCss = css`
            text-align: left;
        `;

        return (
            <div >
                <pre className={formatCss}>
                    {formattedText || this.props.xml}
                </pre>
            </div>
        );
    }
}
