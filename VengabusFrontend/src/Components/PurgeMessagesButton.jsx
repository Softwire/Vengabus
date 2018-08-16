import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import Lodash from 'lodash';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';

class PurgeMessagesButton extends React.Component {
    constructor(props) {
        super(props);

        const vengaServiceBusService = serviceBusConnection.getServiceBusService();

        this.initialState = {
            onPurgeConfirmed: () => { },
            modalBody: ""
        };

        switch (this.props.type) {
            case EndpointTypes.TOPIC:
                this.initialState.onPurgeConfirmed = () => vengaServiceBusService.purgeTopicMessages(this.props.endpointName);
                break;
            case EndpointTypes.QUEUE:
                this.initialState.onPurgeConfirmed = () => vengaServiceBusService.purgeQueueMessages(this.props.endpointName);
                break;
            case EndpointTypes.SUBSCRIPTION:
                this.initialState.onPurgeConfirmed = () => vengaServiceBusService.purgeSubscriptionMessages(this.props.parentName, this.props.endpointName);
                break;
            default: break;
        }

        this.state = this.initialState;
    }

    showModalAction = () => {
        this.generateModalWarningBody().then(bodyResult => this.setState({ modalBody: bodyResult }));
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
                <p>Are you sure you want to purge the messages from {this.props.type} "{this.props.endpointName}" ?</p>

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
                <p> This action will purge the messages from the following subscriptions: </p>
                <ul>
                    {liArray}
                </ul>
            </React.Fragment>
        );
    }

    resetState = () => {
        this.setState({ modalBody: "" });
    }

    render() {
        let buttonText = <span>Purge Messages <Glyphicon glyph="trash" /></span>;
        return (<ButtonWithConfirmationModal
            id={"alertPurge"}
            buttonText={buttonText}
            modalTitle={"Purge messages from " + this.props.type}
            modalBody={this.state.modalBody}
            confirmButtonText={"Purge"}
            afterShowModalAction={this.showModalAction}
            confirmAction={this.state.onPurgeConfirmed}
            afterCloseModalAction={this.resetState}
        />);
    }
}

export { PurgeMessagesButton };
