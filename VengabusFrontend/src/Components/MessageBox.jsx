
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormattingBox } from './FormattingBox';
import { CopyTextButton } from './CopyTextButton';
import { css } from 'emotion';

export class MessageBox extends Component {

    render() {
        const buttonStyle = css`
            float: right;
            margin-left: 5px;
        `;

        return (
            <div className="static-modal">


                <Modal show={this.props.show && this.props.show} onHide={this.props.handleClose} >
                    <Modal.Header>
                        <Modal.Title>Message Id : {this.props.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <FormattingBox
                            data={this.props.messageBody}
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className={buttonStyle} onClick={this.props.handleClose}>Close</Button>
                        <CopyTextButton className={buttonStyle} text={this.props.messageBody} />
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}