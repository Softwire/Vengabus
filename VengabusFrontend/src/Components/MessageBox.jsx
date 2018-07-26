
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { PrettyXMLBox } from './PrettyXmlBox';
import { PrettyJsonBox } from './prettyJsonBox';

export class MessageBox extends Component {

    format(originalMessageText) {
        //QQ when we know the shape of the messege this will be used to pretty print etc
        return originalMessageText + " +formatted";
    }

    render() {

        return (
            <div className="static-modal">


                <Modal show={this.props.show && this.props.show} onHide={this.props.handleClose} >
                    <Modal.Header>
                        <Modal.Title>Message Id : {this.props.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <PrettyJsonBox
                            data={this.props.messageBody}
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.handleClose} >Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}