import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { MessageBox } from './MessageBox';
import { truncate } from 'lodash';

export class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMessage: false
        };
    }
    // QQ delete when final function is implemented

    handleMessageClick = (e, row, rowIndex) => {
        const id = row.messageId;
        const body = row.messageBody;
        this.setState({
            showMessage: true,
            messageId: id,
            messageBody: body
        });
    }

    handleClose = () => {
        this.setState({
            showMessage: false
        });
    }

    render() {
        const messageArray = this.props.messageData ? [...this.props.messageData] : undefined;
        // Add a hidden key column
        if (messageArray) {
            for (let i = 0; i < messageArray.length; i++){
                messageArray[i].hiddenKey = i;
            }
        }

        //add a preview of the body to each field which will be the first 30 chars
        const previewLength = 30;
        for (let i = 0; i < (messageArray ? messageArray.length : 0); i++) {
            const currentMessageArray = messageArray[i];
            currentMessageArray.messageBodyPreview = truncate(currentMessageArray.messageBody, { length: previewLength });
        }

        const colProps = [
            {
                dataField: 'hiddenKey',
                hidden: true
            },
            {
                dataField: 'predefinedProperties.messageId',
                text: 'Message Id',
                width: 50,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'messageBodyPreview',
                text: 'Message Body',
                width: 50,
                headerStyle: { textAlign: 'center' }
            }
        ];

        return (
            <div>
                <DataTable
                    name='MessageTable'
                    colProps={colProps}
                    keyColumn='hiddenKey'
                    dataToDisplay={messageArray}
                    defaultHover
                    onRowClick={this.handleMessageClick}
                />

                <MessageBox
                    messageBody={this.state.messageBody}
                    messageId={this.state.messageId}
                    show={this.state.showMessage}
                    handleClose={this.handleClose}

                />
            </div>
        );
    }
}
