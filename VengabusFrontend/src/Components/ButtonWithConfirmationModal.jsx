import React from 'react';
import { Modal, Alert, Button } from 'react-bootstrap';

const defaultState = {
    show: false
};

class ButtonWithConfirmationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = defaultState;
    }

    handleConfirm = () => {
        this.props.confirmAction();
        this.handleClose();
    }

    handleClose = () => {
        if (this.props.afterCloseModalAction) {
            this.props.afterCloseModalAction();
        }
        this.setState(defaultState);
    }

    handleOpening = () => {
        this.setState({ show: true });
        if (this.props.afterShowModalAction) {
            this.props.afterShowModalAction();
        }
    }

    render() {
        return (
            <React.Fragment>
                <Button
                    onClick={this.handleOpening}
                    bsStyle={this.props.buttonStyle ? this.props.buttonStyle : "danger"}
                    disabled={this.props.buttonDisabled ? true : false} >
                    {this.props.buttonText}
                </Button>
                <Modal show={this.state.show} onHide={this.handleClose} >
                    <Modal.Header>
                        <Modal.Title>{this.props.modalTitle}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.props.modalBody ?
                            <Alert bsStyle="danger">
                                {this.props.modalBody}
                            </Alert > : null
                        }
                        {this.props.children}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="confirm" onClick={this.handleConfirm} bsStyle="danger">{this.props.confirmButtonText}</Button>
                        <Button id="cancel" onClick={this.handleClose}>{this.props.cancelButtonText ? this.props.cancelButtonText : "Cancel"}</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}

export { ButtonWithConfirmationModal };
