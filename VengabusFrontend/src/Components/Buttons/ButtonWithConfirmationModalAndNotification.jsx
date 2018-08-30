import React from 'react';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';
import { vengaNotificationManager } from '../../Helpers/VengaNotificationManager';
import { Spinner } from '../Spinner';

const defaultState = {
    showSpinner: false,
    showFinalMessage: false
};

class ButtonWithConfirmationModalAndNotification extends React.Component {
    constructor(props) {
        super(props);

        this.state = { ...defaultState };
    }

    handleNotificationAndSpinner = () => {
        let initialAction = this.props.confirmAction;
        return () => {
            let initialPromise = initialAction();
            //start spinner
            this.setState({ showSpinner: true });
            const showNotificationPromise = initialPromise.then(() => {
                if (this.props.successNotificationMessage) {
                    vengaNotificationManager.success(this.props.successNotificationMessage);
                }
            }).catch((error) => {
                if (!error.isManagedError && this.props.errorNotificationMessage) {
                    vengaNotificationManager.error(this.props.errorNotificationMessage);
                }
            }).finally(() => {
                this.setState({ showSpinner: false, showFinalMessage: true });
                return new Promise((resolve) => {
                    let callback = () => {
                        //this.setState({ showFinalMessage: false });
                        resolve();
                    };
                    setTimeout(callback, 2000);
                });
            });
            //return final promise.

            return showNotificationPromise;
        }
    }

    onModalOpen = () => {
        this.setState({ ...defaultState });
        if (this.props.afterShowModalAction) {
            this.props.afterShowModalAction();
        }
    }

    render() {
        let modalBody;
        let enableButtons = false;

        if (this.state.showSpinner) {
            modalBody = (<Spinner size={25} />);

        } else if (this.state.showFinalMessage) {
            modalBody = this.props.messageAfterSpinner || "Action finished";

        } else if (!this.props.modalBody) {
            modalBody = (<Spinner size={25} />);

        } else {
            modalBody = this.props.modalBody;
            enableButtons = true;
        }

        return <ButtonWithConfirmationModal
            afterShowModalAction={this.onModalOpen}
            confirmAction={this.handleNotificationAndSpinner()}
            afterCloseModalAction={this.props.afterCloseModalAction}
            buttonDisabled={this.props.buttonDisabled}
            buttonSize={this.props.buttonSize}
            buttonStyle={this.props.buttonStyle}
            modalInternalStyle={this.props.modalInternalStyle}
            modalButtonStyle={this.props.modalButtonStyle}
            buttonCSS={this.props.buttonCSS}
            tooltipMessage={this.props.tooltipMessage}
            modalTitle={this.props.modalTitle}
            modalBody={modalBody}
            confirmButtonText={this.props.confirmButtonText}
            cancelButtonText={this.props.cancelButtonText}
            buttonText={this.props.buttonText}
            disableButtons={!enableButtons}
        />
    }
}

export { ButtonWithConfirmationModalAndNotification };