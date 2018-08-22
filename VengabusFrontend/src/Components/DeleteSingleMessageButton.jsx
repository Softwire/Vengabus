import React from 'react';
import { Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';

class DeleteSingleMessageButton extends React.Component {
    getOnDeletionConfirmedHandler = () => {
        let deleteMessage;
        if (this.props.messageType === EndpointTypes.MESSAGE) {
            switch (this.props.endpointType) {
                case EndpointTypes.TOPIC:
                    deleteMessage = () => this.vengaServiceBusService.deleteTopicSingleMessage(this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                case EndpointTypes.QUEUE:
                    deleteMessage = () => this.vengaServiceBusService.deleteQueueSingleMessage(this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                case EndpointTypes.SUBSCRIPTION:
                    deleteMessage = () => this.vengaServiceBusService.deleteSubscriptionSingleMessage(this.props.parentName, this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                default: throw Error("Invalid endpoint type!");
            }
        } else {
            switch (this.props.endpointType) {
                case EndpointTypes.QUEUE:
                    deleteMessage = () => this.vengaServiceBusService.deleteQueueSingleDeadLetterMessage(this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                case EndpointTypes.SUBSCRIPTION:
                    deleteMessage = () => this.vengaServiceBusService.deleteSubscriptionSingleDeadLetterMessage(this.props.parentName, this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                default: throw Error("Invalid endpoint type!");
            }
        }

        const onDeletionConfirmed = () => {
            deleteMessage().then(() => {
                if (this.props.closeParentModal) {
                    this.props.closeParentModal();
                }
            });
        };

        return onDeletionConfirmed;
    }

    showModalAction = () => {
        this.vengaServiceBusService = serviceBusConnection.getServiceBusService();
    }

    generateModalWarningBody = () => {
        return (
            <React.Fragment>
                <p>Are you sure you want to delete this message ?</p>

                <p>Message '{this.props.messageId}' from {this.props.type} '{this.props.endpointName}' will be deleted <b>irreversibly!</b></p>
            </React.Fragment>
        );
    }

    render() {
        let buttonText = <span>Delete Message <Glyphicon glyph="trash" /></span>;
        let tooltipMessage = "Deleting single live message is not supported! Check the backend API for more info.";
        let buttonDisabled = this.props.messageType === EndpointTypes.MESSAGE;

        const tooltip = (
            <Tooltip id="tooltip">
                <strong>{tooltipMessage}</strong>
            </Tooltip>
        );
        const button = (
            <ButtonWithConfirmationModal
                id={"alertDeleteSingleMessage"}
                buttonText={buttonText}
                modalTitle="Delete message"
                modalBody={this.generateModalWarningBody()}
                confirmButtonText={"Delete"}
                afterShowModalAction={this.showModalAction}
                confirmAction={this.getOnDeletionConfirmedHandler()}
                afterCloseModalAction={() => { }}
                buttonDisabled={buttonDisabled}
            />
        );
        return (
            buttonDisabled ? <OverlayTrigger rootClose overlay={tooltip} placement="top">
                <div style={{ display: 'inline-block', cursor: 'not-allowed', float: 'right' }}>
                    {button}</div></OverlayTrigger> : button);
    }
}

export { DeleteSingleMessageButton };
