import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { MessageBox } from './MessageBox';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';
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
        const messageArray = [...this.props.messageData];

        //add a preview of the body to each field which will be the first 30 chars
        const previewLength = 30;
        for (let i = 0; i < messageArray.length; i++) {
            const currentMessageArray = messageArray[i];
            currentMessageArray.messageBodyPreview = truncate(currentMessageArray.messageBody, { length: previewLength });
        }

        const colProps = [
            {
                dataField: 'messageId',
                text: 'Message Id',
                headerStyle: { width: '10%', textAlign: 'center' }
            },
            {
                dataField: 'messageBodyPreview',
                text: 'Message Body',
                headerStyle: { width: '50%', textAlign: 'center' }
            }
        ];

        const tableRowStyle = css`
		          :hover {
		              border: 2px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;

        return (
            <div>
                <DataTable
                    name='MessageTable'
                    colProps={colProps}
                    dataToDisplay={messageArray}
                    tableRowStyle={tableRowStyle}
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
