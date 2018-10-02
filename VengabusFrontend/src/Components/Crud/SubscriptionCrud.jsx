import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { formatDeadletterTimeStamp } from '../../Helpers/FormattingHelpers';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';
import { getSubscriptionCrudProperties } from './CrudPropertyConfig';
import { Spinner } from '../Spinner';

export class SubscriptionCrud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSubscription: this.props.selectedSubscription,
            parentTopic: this.props.parentTopic,
            subscriptionData: undefined,
            newSubscriptionData: undefined,
            receivedData: false,
            mostRecentDeadletter: undefined
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
            this.setState({ subscriptionData: subDetails, newSubscriptionData: subDetails, receivedData: true });
        });

        Promise.all([deadletterTimePromise, mainDataPromise]).then(() => {
            this.setState((oldState) => {
                oldState.subscriptionData.mostRecentDeadletter = retrievedDeadletterTimestamp;
                oldState.newSubscriptionData.mostRecentDeadletter = retrievedDeadletterTimestamp;
                return oldState;
            });
        });
    }

    handlePropertyChange = (value, property) => {
        const updatedNewSubscriptionData = { ...this.state.newSubscriptionData };
        updatedNewSubscriptionData[property] = value;
        this.setState({
            newSubscriptionData: updatedNewSubscriptionData
        });
    }

    renameSubscription = (oldName, newName) => {
        //QQ do something with this
        console.error('cannot rename subscriptions because #Microsoft');
    }

    updateSubscription = () => {
        return this.serviceBusService.updateSubscription(this.state.newSubscriptionData);
    }

    deleteSubscription = () => {
        this.serviceBusService.deleteSubscription(this.state.selectedSubscription, this.state.parentTopic);
        pageSwitcher.switchToPage(PAGES.HomePage);
    }

    resetFields = () => {
        this.setState({
            newSubscriptionData: this.state.subscriptionData
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
                        originalEndpointData={this.state.subscriptionData}
                        newEndpointData={this.state.newSubscriptionData}
                        endpointProperties={getSubscriptionCrudProperties()}
                        handlePropertyChange={this.handlePropertyChange}
                        renameEndpoint={this.renameSubscription}
                        updateEndpoint={this.updateSubscription}
                        deleteEndpoint={this.deleteSubscription}
                        resetFields={this.resetFields}
                    />
                ) : (
                    <Spinner size={50} />
                )
        );
    }
}