import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { formatDeadletterTimeStamp } from '../../Helpers/FormattingHelpers';
import { getSubscriptionCrudProperties } from './CrudPropertyConfig';
import { SubscriptionCrudService } from '../../AzureWrappers/EndpointCrudServices';
import { Spinner } from '../Spinner';

export class SubscriptionCrud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSubscription: this.props.selectedSubscription,
            parentTopic: this.props.parentTopic,
            subscriptionData: undefined,
            receivedData: false,
        };
    }

    componentDidMount = () => {
        this.serviceBusService = serviceBusConnection.getServiceBusService();

        const topic = this.state.parentTopic;
        const sub = this.state.selectedSubscription;

        let retrievedDeadletterTimestamp;
        const deadletterTimePromise = this.serviceBusService.getSubscriptionMostRecentDeadletter(topic, sub).then(timestamp => {
            retrievedDeadletterTimestamp = formatDeadletterTimeStamp(timestamp);
        });

        const mainDataPromise = this.serviceBusService.getSubscriptionDetails(topic, sub).then((subDetails) => {
            subDetails.mostRecentDeadletter = null;
            this.setState({ subscriptionData: subDetails, receivedData: true });
        });

        Promise.all([deadletterTimePromise, mainDataPromise]).then(() => {
            this.setState((oldState) => {
                oldState.subscriptionData.mostRecentDeadletter = retrievedDeadletterTimestamp;
                return oldState;
            });
        });
    }

    render() {
        return (
            this.state.receivedData ?
                (
                    <CrudInterface
                        endpointType={EndpointTypes.SUBSCRIPTION}
                        selectedEndpoint={this.state.selectedSubscription}
                        parentTopic={this.state.parentTopic}
                        endpointData={this.state.subscriptionData}
                        endpointProperties={getSubscriptionCrudProperties()}
                        endpointCrudService={new SubscriptionCrudService(this.props.parentTopic)}
                    />
                ) : (
                    <Spinner size={50} />
                )
        );
    }
}