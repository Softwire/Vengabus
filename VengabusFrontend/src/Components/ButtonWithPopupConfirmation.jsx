import React from 'react';
import { Glyphicon, Modal, Alert, Button } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import Lodash from 'lodash';

const defaultState = {
    show: false,
    onConfirmed: () => { }
};

class ButtonWithPopupConfirmation extends React.Component {
    constructor(props) {
        super(props);

        this.state = defaultState;
    }

    handleConfirm = () => {
        this.props.confirmAction();
        this.handleClose();
    }

    handleClose = () => {
        this.props.closeModalAction();
        this.setState(defaultState);
    }

    handleOpening = () => {
        this.setState({ show: true });
        this.props.showModalAction();
    }

    render() {
        return (
            <React.Fragment>
                <Button onClick={this.handleOpening} bsStyle="danger">
                    {this.props.buttonText}
                </Button>
                <Modal show={this.state.show} onHide={this.handleClose} >
                    <Modal.Header>
                        <Modal.Title>{this.props.modalTitle}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Alert bsStyle="danger">
                            {this.props.modalBody}
                        </Alert >
                        {this.props.children}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="confirm" onClick={this.handleConfirm} bsStyle="danger">{this.props.confirmButtonText}</Button>
                        <Button id="cancel" onClick={this.handleClose}>{this.props.cancelButtonText}</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}

export { ButtonWithPopupConfirmation };
