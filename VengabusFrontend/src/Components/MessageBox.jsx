
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export class MessageBox extends Component {
    constructor(props) {
        super(props)
    }

    format(originalMessageText) {
        //QQ when we know the shape of the messege this will be used to pretty print etc
        return originalMessageText + " +formatted";
    }

    render() {
     
        return (
            <div className="static-modal">


                <Modal show={this.props.show && this.props.show} onHide={this.props.handleClose} >
                    <Modal.Header>
                        <Modal.Title>{this.props.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body> {this.format(this.props.messageBody)}</Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.handleClose} >Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}