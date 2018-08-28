import React from 'react';
import { Modal, Alert, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Spinner } from './Spinner';
import { css } from 'react-emotion';

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
        const externalModalTriggerButtonStyle = this.props.buttonStyle || "danger";
        const internalAlertDialogStyle = this.props.modalInternalStyle || "danger";
        const internalConfirmButtonStyle = this.props.modalButtonStyle || internalAlertDialogStyle;

        const tooltipStyling = css`
            cursor: not-allowed;
            float: right;

            button {
                pointer-events: ${this.props.buttonDisabled ? 'none' : 'auto'};
            }
        `;

        const tooltip = (
            <Tooltip id="tooltip">
                <strong>{this.props.tooltipMessage}</strong>
            </Tooltip>
        );

        const button =
            <Button
                onClick={this.handleOpen}
                bsStyle={externalModalTriggerButtonStyle}
                bsSize={this.props.buttonSize || undefined}
                disabled={!!this.props.buttonDisabled}
                className={this.props.buttonCSS}
            >
                {this.props.buttonText}
            </Button>;

        const buttonWithToolTip =
            <OverlayTrigger rootClose overlay={tooltip} placement="top">
                <div className={tooltipStyling}>
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
                        {this.props.modalBody
                            ? (<Alert bsStyle={internalAlertDialogStyle}> {this.props.modalBody} </Alert >)
                            : (<Spinner size={25} />)}
                        {this.props.children}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="confirm" onClick={this.handleConfirm} bsStyle={internalConfirmButtonStyle}>{this.props.confirmButtonText}</Button>
                        <Button id="cancel" onClick={this.handleClose}>{this.props.cancelButtonText || "Cancel"}</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment >
        );
    }
}

export { ButtonWithConfirmationModal };
