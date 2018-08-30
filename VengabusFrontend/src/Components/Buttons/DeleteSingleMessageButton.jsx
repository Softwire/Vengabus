import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';

/*
Returns a button with confirmation modal for deleting a targeted message
Props:
    uniqueId: (REQUIRED) {string} GUID for idenfing the message to be deleted
    messageId (REQUIRED) {string} the message id for idenfing the message to be deleted 
    endpointType (REQUIRED) {EndpointTypes} type of endpoint we want to delete message from
    messageType (REQUIRED) {EndpointTypes} type of message we wamt tp delete
    endpointName (REQUIRED) {string} endpoint name
    parentName (OPTIONAL) {string} in case the endpointType is a Subscription, we also need the parent topic name
    onDeletionEnd (OPTIONAL) {function} function to be called after the deletion took place
    onDeletionStart (OPTIONAL) {function} function to be called before deletion took place
    disabled (OPTIONAL) {boolean} if true, the button is disabled
*/

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
            if (this.props.onDeletionStart)
                this.props.onDeletionStart();
            deleteMessage().catch(() => { }).finally(() => {
                if (this.props.onDeletionEnd) {
                    this.props.onDeletionEnd();
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
        const buttonText = <span>Delete Message <Glyphicon glyph="trash" /></span>;
        const tooltipMessage = "Deleting single live message is not supported! Check the backend API for more info.";
        const deletionIsSupported = this.props.messageType === EndpointTypes.DEADLETTER;
        return (
            <ButtonWithConfirmationModal
                id={"alertDeleteSingleMessage"}
                buttonText={buttonText}
                modalTitle="Delete message"
                modalBody={this.generateModalWarningBody()}
                confirmButtonText={"Delete"}
                afterShowModalAction={this.showModalAction}
                confirmAction={this.getOnDeletionConfirmedHandler()}
                afterCloseModalAction={() => { }}
                buttonDisabled={!deletionIsSupported || this.props.disabled}
                tooltipMessage={deletionIsSupported ? undefined : tooltipMessage}
            />);
    }
}

export { DeleteSingleMessageButton };
