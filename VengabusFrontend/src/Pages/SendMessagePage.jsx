import React, { Component } from 'react';
import { MessageInput } from '../Components/MessageInput';

class Message {
    constructor() {
        this.body = "";
        this.properties = {};
    }
}

export class SendMessagePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: new Message()
        };
    }

    render() {
        return (
            <div>
                <MessageInput />
            </div>
        );
    }
}
