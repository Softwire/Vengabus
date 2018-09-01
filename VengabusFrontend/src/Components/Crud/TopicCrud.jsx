import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { formatDeadletterTimeStamp, parseTimeSpanFromBackend } from '../../Helpers/FormattingHelpers';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';

export class TopicCrud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTopic: this.props.selectedTopic,
            topicData: undefined,
            newTopicData: undefined,
            receivedData: false
        };
    }

    componentDidMount = () => {
        this.serviceBusService = serviceBusConnection.getServiceBusService();

        this.serviceBusService.getTopicDetails(this.state.selectedTopic).then((result) => {
            result.autoDeleteOnIdle = parseTimeSpanFromBackend(result.autoDeleteOnIdle);
            this.setState({ topicData: result, newTopicData: result, receivedData: true });
        });
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyProperties = () => {
        const { subscriptionCount } = this.state.newTopicData;
        const readOnlyPropertiesTemplate = {
            // text in the left column: value in the right column
            "Subscription Count": subscriptionCount
        };
        // Transform into a format that is supported by DataTable
        const readOnlyProperties = Object.entries(readOnlyPropertiesTemplate).map(([key, value]) => ({ name: key, value: value }));
        const editableProperties = [
            'supportOrdering',
            'enablePartitioning',
            'autoDeleteOnIdle',
            'requiresDuplicateDetection',
            'maxSizeInMegabytes',
            'topicStatus'
        ];
        return [editableProperties, readOnlyProperties];
    }

    handlePropertyChange = (value, property) => {
        const updatedNewTopicData = { ...this.state.newTopicData };
        updatedNewTopicData[property] = value;
        this.setState({
            newTopicData: updatedNewTopicData
        });
    }

    renameTopic = (oldName, newName) => {
        this.serviceBusService.renameTopic(oldName, newName);
        this.setState({
            topicData: { ...this.state.topicData, name: newName },
            newTopicData: { ...this.state.newTopicData, name: newName },
            selectedTopic: newName
        });
    }

    updateTopic = () => {
        this.serviceBusService.updateTopic(this.state.newTopicData);
    }

    deleteTopic = () => {
        this.serviceBusService.deleteTopic(this.state.selectedTopic);
        pageSwitcher.switchToPage(PAGES.HomePage);
    }

    resetFields = () => {
        this.setState({
            newTopicData: this.state.topicData
        });
    }

    render() {
        return (
            this.state.receivedData ?
                (
                    <CrudInterface
                        endpointType={EndpointTypes.TOPIC}
                        selectedEndpoint={this.state.selectedTopic}
                        endpointData={this.state.topicData}
                        newEndpointData={this.state.newTopicData}
                        getEditableAndReadOnlyProperties={this.getEditableAndReadOnlyProperties}
                        handlePropertyChange={this.handlePropertyChange}
                        renameEndpoint={this.renameTopic}
                        updateEndpoint={this.updateTopic}
                        deleteEndpoint={this.deleteTopic}
                        resetFields={this.resetFields}
                    />
                ) : (
                    <p>Fetching data</p>
                )
        );
    }
}