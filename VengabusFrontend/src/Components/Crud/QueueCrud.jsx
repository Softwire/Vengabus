import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { formatDeadletterTimeStamp } from '../../Helpers/FormattingHelpers';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';
import { getQueueCrudProperties } from './CrudPropertyConfig';

export class QueueCrud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueue: this.props.selectedQueue,
            queueData: undefined,
            newQueueData: undefined,
            receivedData: false,
            mostRecentDeadletter: undefined
        };
    }

    componentDidMount = () => {
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        //qqMDM async on these 3.
        let retrievedDeadletterTimestamp;
        const deadletterTimePromise = this.serviceBusService.getQueueMostRecentDeadletter(this.state.selectedQueue).then(timestamp => {
            retrievedDeadletterTimestamp = formatDeadletterTimeStamp(timestamp);
        });
        const mainDataPromise = this.serviceBusService.getQueueDetails(this.state.selectedQueue).then((queueDetails) => {
            this.setState({ queueData: queueDetails, newQueueData: queueDetails, receivedData: true });
        });

        Promise.all([deadletterTimePromise, mainDataPromise]).then(() => {
            this.setState((oldState) => {
                oldState.queueData.mostRecentDeadletter = retrievedDeadletterTimestamp;
                oldState.newQueueData.mostRecentDeadletter = retrievedDeadletterTimestamp;
                return oldState;
            });
        });
    }

    handlePropertyChange = (value, property) => {
        const updatedNewQueueData = { ...this.state.newQueueData };
        updatedNewQueueData[property] = value;
        this.setState({
            newQueueData: updatedNewQueueData
        });
    }

    renameQueue = (oldName, newName) => {
        this.serviceBusService.renameQueue(oldName, newName); // qqMDM set State on completion
        this.setState({
            queueData: { ...this.state.queueData, name: newName },
            newQueueData: { ...this.state.newQueueData, name: newName },
            selectedQueue: newName
        });
    }

    updateQueue = () => {
        return this.serviceBusService.updateQueue(this.state.newQueueData);
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
                        endpointProperties={getQueueCrudProperties()}
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