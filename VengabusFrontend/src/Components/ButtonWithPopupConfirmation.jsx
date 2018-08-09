import React from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';

const defaultState = {
    show: false
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
                <Button onClick={this.handleOpening} bsStyle={this.props.buttonStyle}>
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
