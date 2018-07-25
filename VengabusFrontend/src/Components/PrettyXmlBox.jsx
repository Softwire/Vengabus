// a component that just takes in some xml and returns it in a div

import React, { Component } from 'react';
import { css } from 'react-emotion';
const format = require("xml-formatter");

export class PrettyXMLBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
           
        const formattedXml = format(this.props.xml);

        const formatCss = css`
            text-align: left;
        `;

        return (
            <div >
                <pre className={formatCss}>
                    {formattedXml}
                </pre>
            </div>
        );
    }
}
