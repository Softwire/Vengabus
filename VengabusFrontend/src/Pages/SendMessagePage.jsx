import React, { Component } from 'react';
import { MessageInput } from '../Components/SendMessagePage/MessageInput';

export class SendMessagePage extends Component {
    render() {
        return (
            <div>
                <MessageInput {...this.props} />
            </div>
        );
    }
}
