import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { getTopicCrudProperties } from './CrudPropertyConfig';
import { TopicCrudService } from '../../AzureWrappers/EndpointCrudServices';
import { Spinner } from '../Spinner';

export class TopicCrud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTopic: this.props.selectedTopic,
            topicData: undefined,
            receivedData: false
        };
    }

    componentDidMount = () => {
        this.serviceBusService = serviceBusConnection.getServiceBusService();

        this.serviceBusService.getTopicDetails(this.state.selectedTopic).then((topicSummary) => {
            this.setState({ topicData: topicSummary, receivedData: true });
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
                        endpointProperties={getTopicCrudProperties()}
                        endpointCrudService={new TopicCrudService()}
                    />
                ) : (
                    <Spinner size={50} />
                )
        );
    }
}