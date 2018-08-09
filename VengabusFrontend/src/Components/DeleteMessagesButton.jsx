import React from 'react';
import { Glyphicon, Modal, Alert, Button } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import Lodash from 'lodash';
import { ButtonWithPopupConfirmation } from './ButtonWithPopupConfirmation';

const defaultState = {
    modalBody: "",
    onDeletionConfirmed: () => { }
}

class DeleteMessagesButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = defaultState;
    }

    showModalAction = () => {
        this.setState({ show: true });
        this.generateModalWarningBody().then(bodyResult => this.setState({ modalBody: bodyResult }));
        this.getOnDeletionConfirmed().then(onDeletionResult => this.setState({ onDeletionConfirmed: onDeletionResult }));
    }

    generateModalWarningBody = async () => {
        const vengaServiceBusService = serviceBusConnection.getServiceBusService();
        let numMessages = 0;
        let topicSubList = "";
        let response;

        switch (this.props.type) {
            case EndpointTypes.QUEUE:
                response = await vengaServiceBusService.getQueueDetails(this.props.endpointName);
                numMessages = response.activeMessageCount;
                break;
            case EndpointTypes.TOPIC:
                response = await vengaServiceBusService.listSubscriptions(this.props.endpointName);
                numMessages = Lodash.sumBy(response, (subscription) => {
                    return subscription.activeMessageCount;
                });

                topicSubList = Lodash.map(response, (subscription) => {
                    return subscription.name;
                });
                break;
            case EndpointTypes.SUBSCRIPTION:
                response = await vengaServiceBusService.getSubscriptionDetails(this.props.parentName, this.props.endpointName);
                numMessages = response.activeMessageCount;
                break;
            default: break;
        }

        return (
            <React.Fragment>
                <p>Are you sure you want to delete all the messages from {this.props.type} "{this.props.endpointName}" ?</p>

                {this.props.type === EndpointTypes.TOPIC ? this.generateTopicModalBody(topicSubList) : ""}

                <p>{numMessages} messages will be deleted <b>irreversibly</b>!</p >
            </React.Fragment>
        );
    }

    generateTopicModalBody = (topicSubList) => {
        const liArray = topicSubList.map(function (listValue, index) {
            return <li key={index}>{listValue}</li>;
        });

        return (
            <React.Fragment>
                <p> This action will delete all the messages from the following subscriptions: </p>
                <ul>
                    {liArray}
                </ul>
            </React.Fragment>
        );
    }

    resetState = () => {
        this.setState(defaultState);
    }

    getOnDeletionConfirmed = async () => {
        const vengaServiceBusService = serviceBusConnection.getServiceBusService();
        let deletionFunc;
        switch (this.props.type) {
            case EndpointTypes.TOPIC:
                deletionFunc = () => vengaServiceBusService.deleteTopicMessages(this.props.endpointName);
                break;
            case EndpointTypes.QUEUE:
                deletionFunc = () => vengaServiceBusService.deleteQueueMessages(this.props.endpointName);
                break;
            case EndpointTypes.SUBSCRIPTION:
                deletionFunc = () => vengaServiceBusService.deleteSubscriptionMessages(this.props.parentName, this.props.endpointName);
                break;
            default: break;
        }
        return () => {
            deletionFunc();
        };
    }

    render() {
        let buttonText = (
            <span>Delete All Messages <Glyphicon glyph="trash" /></span>
        );
        let sampleChildren = (
            <Alert bsStyle="info">
                {"This is a sample child to show that the children functionality works."}
            </Alert >
        );
        return (
            <ButtonWithPopupConfirmation
                buttonText={buttonText}
                modalTitle={"Delete all messages from " + this.props.type}
                modalBody={this.state.modalBody}
                confirmButtonText={"Delete"}
                cancelButtonText={"Cancel"}
                showModalAction={this.showModalAction}
                children={sampleChildren}
                confirmAction={this.state.onDeletionConfirmed}
                closeModalAction={this.resetState}
            />
        );
    }
}

export { DeleteMessagesButton };
