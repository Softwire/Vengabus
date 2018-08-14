import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';

class DeleteSingleMessageButton extends React.Component {
    constructor(props) {
        super(props);

        const vengaServiceBusService = serviceBusConnection.getServiceBusService();

        this.initialState = {
            onDeletionConfirmed: () => { },
            modalBody: ""
        };

        if (this.props.messageType === EndpointTypes.MESSAGE) {
            switch (this.props.type) {
                case EndpointTypes.TOPIC:
                    this.initialState.onDeletionConfirmed = () => vengaServiceBusService.deleteTopicSingleMessage(this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                case EndpointTypes.QUEUE:
                    this.initialState.onDeletionConfirmed = () => vengaServiceBusService.deleteQueueSingleMessage(this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                case EndpointTypes.SUBSCRIPTION:
                    this.initialState.onDeletionConfirmed = () => vengaServiceBusService.deleteSubscriptionSingleMessage(this.props.parentName, this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                default: break;
            }
        } else {
            switch (this.props.type) {
                case EndpointTypes.QUEUE:
                    this.initialState.onDeletionConfirmed = () => vengaServiceBusService.deleteQueueSingleDeadLetterMessage(this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                case EndpointTypes.SUBSCRIPTION:
                    this.initialState.onDeletionConfirmed = () => vengaServiceBusService.deleteSubscriptionSingleDeadLetterMessage(this.props.parentName, this.props.endpointName, this.props.messageId, this.props.uniqueId);
                    break;
                default: break;
            }
        }

        this.state = this.initialState;
    }

    showModalAction = () => {
        this.generateModalWarningBody().then(bodyResult => this.setState({ modalBody: bodyResult }));
    }

    generateModalWarningBody = async () => {
        return (
            <React.Fragment>
                <p>Are you sure you want to delete this message ?</p>

                <p>"{this.props.messageId}" message will be deleted <b>irreversibly</b>!</p >
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
