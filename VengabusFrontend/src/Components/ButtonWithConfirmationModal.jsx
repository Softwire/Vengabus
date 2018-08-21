import React from 'react';
import { Modal, Alert, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';

const defaultState = {
    show: false
};

class ButtonWithConfirmationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = defaultState;
    }

    handleOpen = () => {
        const afterOpen = (this.props.afterShowModalAction || (() => { }));
        this.setState({ show: true }, afterOpen);
    }

    handleConfirm = () => {
        this.props.confirmAction();
        this.handleClose();
    }

    handleClose = () => {
        const afterClose = (this.props.afterCloseModalAction || (() => { }));
        this.setState(defaultState, afterClose);
    }

    render() {
        const style = this.props.buttonDisabled ? {
            pointerEvents: 'none'
        } : {};

        const tooltip = (
            <Tooltip id="tooltip">
                <strong>{this.props.tooltipMessage}</strong>
            </Tooltip>
        );

        const button =
            <Button
                onClick={this.handleOpen}
                bsStyle={this.props.buttonStyle || "danger"}
                disabled={!!this.props.buttonDisabled}
                style={style}
            >
                {this.props.buttonText}
            </Button>;

        const buttonWithToolTip =
            <OverlayTrigger rootClose overlay={tooltip} placement="top">
                <div style={{ display: 'inline-block', cursor: 'not-allowed', float: 'right' }}>
                    {button}
                </div>
            </OverlayTrigger>;


        return (
            <React.Fragment>
                {this.props.tooltipMessage ? buttonWithToolTip : button}
                <Modal show={this.state.show} onHide={this.handleClose} >
                    <Modal.Header>
                        <Modal.Title>{this.props.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.modalBody ?
                            <Alert bsStyle={this.props.buttonStyle ? this.props.buttonStyle : "danger"}>
                                {this.props.modalBody}
                            </Alert > : null
                        }
                        {this.props.children}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="confirm" onClick={this.handleConfirm} bsStyle="danger">{this.props.confirmButtonText}</Button>
                        <Button id="cancel" onClick={this.handleClose}>{this.props.cancelButtonText || "Cancel"}</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment >
        );
    }
}

export { ButtonWithConfirmationModal };
