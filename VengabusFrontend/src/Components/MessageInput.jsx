import React, { Component } from 'react';
import { css } from 'react-emotion';
import { grey, blue } from '../colourScheme';
import { MessagePropertyInput } from './MessagePropertyInput';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    Panel
} from "react-bootstrap";

export class MessageInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageBody: ""
        };
    }

    handleMessagebodyChange = event => {
        this.setState({ messageBody: event.target.value });
    };

    submitMessage = (message) => {
        message.body = this.state.messageBody;
        console.table(message);
    }

    render() {
        const formStyle = css`
            padding: 5px;
            width: 85%;
            height: 1080px;
            float: left;
        `;
        return (
            <div className={formStyle}>
                <form>
                    <FormGroup controlId="formControlsMessageBodyText" onChange={this.handleMessagebodyChange}>
                        <ControlLabel>Body</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Enter message body" />
                    </FormGroup>
                </form>
                <MessagePropertyInput submitMessage={this.submitMessage} />
            </div >
        );
    }

}
