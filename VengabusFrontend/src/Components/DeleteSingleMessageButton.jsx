import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';

class DeleteSingleMessageButton extends React.Component {
    constructor(props) {
        super(props);

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
                if (this.props.afterConfirmationAction) {
                    this.props.afterConfirmationAction();
                }
            });

        };

        this.state = {
            onDeletionConfirmed: onDeletionConfirmed,
            modalBody: ""
        };
    }

    showModalAction = () => {
        this.vengaServiceBusService = serviceBusConnection.getServiceBusService();
        this.setState({ modalBody: this.generateModalWarningBody() });
    }

    generateModalWarningBody = () => {
        return (
            <React.Fragment>
                <p>Are you sure you want to delete this message ?</p>

                <p>Message '{this.props.messageId}' from {this.props.type} '{this.props.endpointName}' will be deleted <b>irreversibly!</b></p>
            </React.Fragment>
        );
    }

    resetState = () => {
        this.setState({ modalBody: "" });
    }

    render() {
        let buttonText = <span>Delete Message <Glyphicon glyph="trash" /></span>;
        return <ButtonWithConfirmationModal
            id={"alertDeleteSingleMessage"}
            buttonText={buttonText}
            modalTitle="Delete message"
            modalBody={this.state.modalBody}
            confirmButtonText={"Delete"}
            afterShowModalAction={this.showModalAction}
            confirmAction={this.state.onDeletionConfirmed}
            afterCloseModalAction={this.resetState}
        />;
    }
}

export { DeleteSingleMessageButton };
