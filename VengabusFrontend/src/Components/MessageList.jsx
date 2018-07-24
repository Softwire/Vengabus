import React, { Component } from 'react';
import { DataTable} from './DataTable';
import { MessageBox } from './MessageBox';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';

export class MessageList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMessage: false
        }
    }
    // delete when final function is implemented
 
    handleMessegeclick= (e, row, rowIndex)=>  {
        const id = row.messageId;
        const body = row.messageBody;
        console.log(id + body);
        this.setState({
            showMessage: true,
            messageId: id,
            messageBody: body
        });
        console.log(this.state.showMessage);
    }

    handleClose = () => {
        this.setState({
            showMessage: false
        })
    }

    render() {
        let messageArray = this.props.messageData;

        //add a preview of the body to each feild which will be the first 50 chars

        for (let i = 0; i < messageArray.length; i++) {
            messageArray[i].messageBodyPre = messageArray[i].messageBody.slice(0, 30);
            if (messageArray[i].messageBody.length > 30) {
                messageArray[i].messageBodyPre = messageArray[i].messageBody.slice(0, 30);
                messageArray[i].messageBodyPre = messageArray[i].messageBodyPre + " ...";
            }
        }

        const colProps = [
            {
                dataField: 'messageId',
                text: 'Message id',
                headerStyle: { width: '10%', textAlign: 'center' }
            },
            {
                dataField: 'messageBodyPre',
                text: 'Message body',
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
                    onRowClick={this.handleMessegeclick}
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
