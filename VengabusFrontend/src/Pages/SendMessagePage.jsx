import React, { Component } from 'react';
import { MessageInput } from '../Components/MessageInput';

export class SendMessagePage extends Component {
    render() {
        return (
            <div>
                <MessageInput {...this.props} />
            </div>
        );
    }
}
