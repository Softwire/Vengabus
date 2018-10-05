import React from 'react';
import { Glyphicon } from 'react-bootstrap';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import Lodash from 'lodash';
import { ButtonWithConfirmationModalAndNotification } from './ButtonWithConfirmationModalAndNotification';

class PurgeMessagesButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalBody: ""
        };
    }

    getOnPurgeConfirmedHandler = () => {
        if (this.props.messageType === EndpointTypes.MESSAGE) {
            switch (this.props.type) {
                case EndpointTypes.TOPIC:
                    return () => this.vengaServiceBusService.purgeTopicMessages(this.props.endpointName);
                case EndpointTypes.QUEUE:
                    return () => this.vengaServiceBusService.purgeQueueMessages(this.props.endpointName);
                case EndpointTypes.SUBSCRIPTION:
                    return () => this.vengaServiceBusService.purgeSubscriptionMessages(this.props.parentName, this.props.endpointName);
                default: break;
            }
        } else {
            switch (this.props.type) {
                case EndpointTypes.TOPIC:
                    return () => this.vengaServiceBusService.purgeTopicDeadletterMessages(this.props.endpointName);
                case EndpointTypes.QUEUE:
                    return () => this.vengaServiceBusService.purgeQueueDeadletterMessages(this.props.endpointName);
                case EndpointTypes.SUBSCRIPTION:
                    return () => this.vengaServiceBusService.purgeSubscriptionDeadletterMessages(this.props.parentName, this.props.endpointName);
                default: break;
            }
        }
    }

    showModalAction = () => {
        this.setState({ modalBody: "" });
        this.vengaServiceBusService = serviceBusConnection.getServiceBusService();
        this.generateModalWarningBody().then(bodyResult => this.setState({ modalBody: bodyResult }));//qq needs catch, close modal, needs refactor
    }

    generateModalWarningBody = async () => {
        const vengaServiceBusService = serviceBusConnection.getServiceBusService();
        let numMessages = 0;
        let topicSubList = "";
        let response;

        const messageCountPropertyName = (this.props.messageType === EndpointTypes.MESSAGE) ? 'activeMessageCount' : 'deadletterMessageCount';

        switch (this.props.type) {
            case EndpointTypes.QUEUE:
                response = await vengaServiceBusService.getQueueDetails(this.props.endpointName);
                numMessages = response[messageCountPropertyName];
                break;
            case EndpointTypes.TOPIC:
                response = await vengaServiceBusService.listSubscriptions(this.props.endpointName);
                numMessages = Lodash.sumBy(response, (subscription) => {
                    return subscription[messageCountPropertyName];
                });

                topicSubList = Lodash.map(response, (subscription) => {
                    return subscription.name;
                });
                break;
            case EndpointTypes.SUBSCRIPTION:
                response = await vengaServiceBusService.getSubscriptionDetails(this.props.parentName, this.props.endpointName);
                numMessages = response[messageCountPropertyName];
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

    render() {
        const buttonText = this.props.messageType === EndpointTypes.MESSAGE ? "Purge Live Messages" : "Purge Deadletters";
        const buttonSpanText = <span>{buttonText} <Glyphicon glyph="trash" /></span>;

        return (
            <ButtonWithConfirmationModalAndNotification
                id="alertPurge"
                buttonText={buttonSpanText}
                modalTitle={"Purge messages from " + this.props.type}
                modalBody={this.state.modalBody}
                confirmButtonText="Purge"
                afterShowModalAction={this.showModalAction}
                confirmAction={this.getOnPurgeConfirmedHandler()}
                successNotificationMessage="Messages purged successfully!"
                errorNotificationMessage="Messages purging failed!"
                messageAfterSpinner="Purged complete!"
            />
        );
    }
}

export { PurgeMessagesButton };
