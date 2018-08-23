import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { formatTimeStamp, parseTimeSpanFromBackend } from '../../Helpers/FormattingHelpers';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';

export class QueueCrud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueue: this.props.selectedQueue,
            queueData: undefined,
            newQueueData: undefined,
            receivedData: false
        };
    }

    componentDidMount = () => {
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        this.serviceBusService.getQueueDetails(this.state.selectedQueue).then((result) => {
            result.autoDeleteOnIdle = parseTimeSpanFromBackend(result.autoDeleteOnIdle);
            if (result.mostRecentDeadLetter) { result.mostRecentDeadLetter = formatTimeStamp(result.mostRecentDeadLetter); }
            this.setState({ queueData: result, newQueueData: result, receivedData: true });
        });
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyProperties = () => {
        const { activeMessageCount, deadletterMessageCount, mostRecentDeadLetter } = this.state.newQueueData;
        const readOnlyPropertiesTemplate = {
            // text in the left column: value in the right column
            "Active Message Count": activeMessageCount,
            "Deadletter Message Count": deadletterMessageCount,
            "Most Recent Deadletter": mostRecentDeadLetter
        };
        const readOnlyProperties = Object.entries(readOnlyPropertiesTemplate).map(([key, value]) => ({ name: key, value: value }));
        const editableProperties = [
            'supportOrdering',
            'requiresSession',
            'enablePartitioning',
            'autoDeleteOnIdle',
            'enableDeadLetteringOnMessageExpiration',
            'requiresDuplicateDetection',
            'maxDeliveryCount',
            'maxSizeInMegabytes',
            'status'
        ];
        return [editableProperties, readOnlyProperties];
    }

    handlePropertyChange = (value, property) => {
        const updatedNewQueueData = { ...this.state.newQueueData };
        updatedNewQueueData[property] = value;
        this.setState({
            newQueueData: updatedNewQueueData
        });
    }

    renameQueue = (oldName, newName) => {
        this.serviceBusService.renameQueue(oldName, newName);
        this.setState({
            queueData: { ...this.state.queueData, name: newName },
            newQueueData: { ...this.state.newQueueData, name: newName },
            selectedQueue: newName
        });
    }

    updateQueue = () => {
        this.serviceBusService.updateQueue(this.state.newQueueData);
    }

    deleteQueue = () => {
        this.serviceBusService.deleteQueue(this.state.selectedQueue);
        pageSwitcher.switchToPage(PAGES.HomePage);
    }

    resetFields = () => {
        this.setState({
            newQueueData: this.state.queueData
        });
    }

    render() {
        return (
            this.state.receivedData ?
                (
                    <CrudInterface
                        endpointType={EndpointTypes.QUEUE}
                        selectedEndpoint={this.state.selectedQueue}
                        endpointData={this.state.queueData}
                        newEndpointData={this.state.newQueueData}
                        getEditableAndReadOnlyProperties={this.getEditableAndReadOnlyProperties}
                        handlePropertyChange={this.handlePropertyChange}
                        renameEndpoint={this.renameQueue}
                        updateEndpoint={this.updateQueue}
                        deleteEndpoint={this.deleteQueue}
                        resetFields={this.resetFields}
                    />
                ) : (
                    <p>Fetching data</p>
                )
        );
    }
}