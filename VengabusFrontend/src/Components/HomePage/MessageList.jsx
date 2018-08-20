import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { MessageBox } from '../MessageBox/MessageBox';
import { truncate } from 'lodash';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { css } from 'react-emotion';


export class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMessage: false
        };
    }

    handleMessageClick = (e, row, rowIndex) => {
        const id = row.messageId;
        const body = row.messageBody;
        this.setState({
            showMessage: true,
            messageId: id,
            messageBody: body,
            message: row
        });
    }

    handleClose = () => {
        this.setState({
            showMessage: false
        });
    }

    render() {
        const messageArray = this.props.messageData ? [...this.props.messageData] : undefined;
        //add a preview of the body to each field which will be the first 30 chars
        const previewLength = 30;
        for (let i = 0; i < (messageArray ? messageArray.length : 0); i++) {
            const currentMessageArray = messageArray[i];
            currentMessageArray.messageBodyPreview = truncate(currentMessageArray.messageBody, { length: previewLength });
            const enqueuedTime = currentMessageArray.predefinedProperties.enqueuedTimeUtc;
            if (enqueuedTime) {
                currentMessageArray.timestamp = formatTimeStamp(enqueuedTime);
            } else {
                currentMessageArray.timestamp = '##-##-#### ##:##:##';
            }
        }

        //92 for height of 3 lines of text
        const minHeight = css`
                min-height:92px;
                height:92px;
            `;

        
        const colProps = [
            {
                dataField: 'uniqueId',
                hidden: true
            },
            {
                dataField: 'predefinedProperties.messageId',
                text: 'Message Id',
                width: 33,
                headerClasses: minHeight
            },
            {
                dataField: 'messageBodyPreview',
                text: 'Message Body',
                width: 33,
                headerClasses: minHeight
            },
            {
                dataField: 'timestamp',
                width: 34,
                headerClasses: minHeight
    
            }
        ];

        return (
            <div>
                <DataTable
                    name='MessageTable'
                    colProps={colProps}
                    uniqueKeyColumn='uniqueId'
                    dataToDisplay={messageArray}
                    defaultHover
                    onRowClick={this.handleMessageClick}
                    paginated
                    searchable
                />

                <MessageBox
                    message={this.state.message}
                    show={this.state.showMessage}
                    endpointType={this.props.endpointType}
                    messageType={this.props.messageType}
                    endpointName={this.props.endpointName}
                    endpointParent={this.props.endpointParent}
                    handleClose={this.handleClose}
                    refreshMessageTableHandler={this.props.refreshMessageTableHandler}
                />
            </div>
        );
    }
}
