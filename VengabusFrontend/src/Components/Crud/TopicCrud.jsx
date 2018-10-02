import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';
import { getTopicCrudProperties } from './CrudPropertyConfig';
import { Spinner } from '../Spinner';

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

        this.serviceBusService.getTopicDetails(this.state.selectedTopic).then((topicSummary) => {
            this.setState({ topicData: topicSummary, newTopicData: topicSummary, receivedData: true });
        });
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
        return this.serviceBusService.updateTopic(this.state.newTopicData);
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
                        originalEndpointData={this.state.topicData}
                        newEndpointData={this.state.newTopicData}
                        endpointProperties={getTopicCrudProperties()}
                        handlePropertyChange={this.handlePropertyChange}
                        renameEndpoint={this.renameTopic}
                        updateEndpoint={this.updateTopic}
                        deleteEndpoint={this.deleteTopic}
                        resetFields={this.resetFields}
                    />
                ) : (
                    <Spinner size={50} />
                )
        );
    }
}