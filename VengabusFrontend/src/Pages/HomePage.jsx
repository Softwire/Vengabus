import React, { Component } from 'react';
import { ExampleServiceBusCall } from '../Components/ExampleServiceBusCall';
import { QueueList } from '../Components/QueueList';
import { MessageBox } from '../Components/MessageBox';
import { css } from 'react-emotion';
import { Button } from 'react-bootstrap';

export class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrievedData: undefined,
            showMessage: false
        };
    }

    updateRetrievedData = (data) => {
        this.setState({ retrievedData: data });
    };

    handleClose = () => {
        this.setState({
            showMessage: false
        })
    }
    handleMessegeclick = (id, body) => {
        console.log(id + body);
        this.setState({
            showMessage: true,
            messageId: id,
            messageBody: body
        });
        console.log(this.state.showMessage);
    }


    render() {
        const queueDivStyle = css`
            width: 30%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;
        return (
            <div>

                <Button onClick={() => this.handleMessegeclick("message A", "messgage a body")} > Open message A </Button>
                <Button onClick={() => this.handleMessegeclick("message B", "messgage b body")} > Open message B </Button>

                <MessageBox
                    messageBody={this.state.messageBody}
                    messageId={this.state.messageId}
                    show={this.state.showMessage}
                    handleClose={this.handleClose}

                />


                <ExampleServiceBusCall onDataReceive={this.updateRetrievedData} />
                <div className={queueDivStyle}>
                    <QueueList queueData={this.state.retrievedData} />
                </div>
            </div>
        );
    }
}
