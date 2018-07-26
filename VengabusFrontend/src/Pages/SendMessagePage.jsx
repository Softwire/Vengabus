import React, { Component } from 'react';
import { MessageInput } from '../Components/MessageInput';

export class SendMessagePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <MessageInput message={this.props.message} />
            </div>
        );
    }
}
