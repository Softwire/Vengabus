import React from 'react';
import { Modal, Alert, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Spinner } from './Spinner';
import { css } from 'react-emotion';

/*
Returns a button with confirmation modal
Props:
    buttonText: (REQUIRED) {string} text to be displayed on the button that triggers the modal
    modalTitle: (REQUIRED) {string} title to be displayed on the modal
    modalBody: (REQUIRED) {string} body to be displayed on the modal
    confirmButtonText: (REQUIRED) {string} text to be displayed on the confirmation button
    confirmAction: (REQUIRED) {function} function to be called on pressing confirmation button
    afterShowModalAction: (OPTIONAL) {function} function to be called after modal is shown
    afterCloseModalAction: (OPTIONAL) {function} function to be called after modal is closed
    buttonDisabled: (OPTIONAL) {boolean} if true, the button that triggers the modal is disabled
    tooltipMessage (OPTIONAL) {string} if it exists, it adds a tooltip on button hover
*/

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
        const confirmActionOutput = this.props.confirmAction();
        Promise.resolve(confirmActionOutput).then(this.handleClose);
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
