import React, { Component } from 'react';
import { css } from 'react-emotion';

import {
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";

export class MessageBodyInput extends Component {
    render() {
        const headingStyle = css`
            font-weight: bold;
            margin-left: 5px;
        `;
        const leftAlign = css`
            text-align:left;
        `;
        const bodyStyle = css`
            min-height: 350px;
            padding-left: 5px;
        `;
        return (
            <form>
                <FormGroup
                    className={leftAlign}
                    controlId="formControlsMessageBodyText"
                >
                    <ControlLabel className={headingStyle}>Body</ControlLabel>
                    <FormControl
                        componentClass="textarea"
                        placeholder="Enter message body"
                        className={bodyStyle}
                        value={this.props.messageBody}
                        onChange={(event) => this.props.handleMessageBodyChange(event.target.value)}
                    />
                </FormGroup>
            </form>
        );
    }
}