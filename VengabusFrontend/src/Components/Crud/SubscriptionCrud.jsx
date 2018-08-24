import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { formatTimeStamp, parseTimeSpanFromBackend } from '../../Helpers/FormattingHelpers';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';

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
        this.serviceBusService.getSubscriptionMostRecentDeadletter(this.state.parentTopic, this.state.selectedSubscription).then(result => {
            result = formatTimeStamp(result);
            this.setState({ mostRecentDeadLetter: result });
        });
        this.serviceBusService.getSubscriptionDetails(this.state.parentTopic, this.state.selectedSubscription).then((result) => {
            result.autoDeleteOnIdle = parseTimeSpanFromBackend(result.autoDeleteOnIdle);
            this.setState({ subscriptionData: result, newSubscriptionData: result, receivedData: true });
        });
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyProperties = () => {
        const { activeMessageCount, deadletterMessageCount, topicName } = this.state.newSubscriptionData;
        const readOnlyPropertiesTemplate = {
            // text in the left column: value in the right column
            "Parent Topic": topicName,
            "Active Message Count": activeMessageCount,
            "Deadletter Message Count": deadletterMessageCount,
            "Most Recent Deadletter": this.state.mostRecentDeadLetter
        };
        // Transform into a format that is supported by DataTable
        const readOnlyProperties = Object.entries(readOnlyPropertiesTemplate).map(([key, value]) => ({ name: key, value: value }));
        const editableProperties = [
            'requiresSession',
            'autoDeleteOnIdle',
            'enableDeadLetteringOnMessageExpiration',
            'maxDeliveryCount',
            'subscriptionStatus'
        ];
        return [editableProperties, readOnlyProperties];
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
        console.log('cannot rename subscriptions because #Microsoft');
    }

    updateSubscription = () => {
        this.serviceBusService.updateSubscription(this.state.newEndpointData);
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
                        endpointData={this.state.subscriptionData}
                        newEndpointData={this.state.newSubscriptionData}
                        getEditableAndReadOnlyProperties={this.getEditableAndReadOnlyProperties}
                        handlePropertyChange={this.handlePropertyChange}
                        renameEndpoint={this.renameSubscription}
                        updateEndpoint={this.updateSubscription}
                        deleteEndpoint={this.deleteSubscription}
                        resetFields={this.resetFields}
                    />
                ) : (
                    <p>Fetching data</p>
                )
        );
    }
}