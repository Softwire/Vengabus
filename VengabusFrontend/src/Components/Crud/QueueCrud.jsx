import React, { Component } from 'react';
import { CrudInterface } from './CrudInterface';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { formatDeadletterTimeStamp } from '../../Helpers/FormattingHelpers';
import { getQueueCrudProperties } from './CrudPropertyConfig';
import { QueueCrudService } from '../../AzureWrappers/EndpointCrudServices';
import { Spinner } from '../Spinner';

export class QueueCrud extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueue: this.props.selectedQueue,
            queueData: undefined,
            receivedData: false,
        };
    }

    componentDidMount = () => {
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        //qqMDM async on these 3.
        const queue = this.state.selectedQueue;

        let retrievedDeadletterTimestamp;
        const deadletterTimePromise = this.serviceBusService.getQueueMostRecentDeadletter(queue).then(timestamp => {
            retrievedDeadletterTimestamp = formatDeadletterTimeStamp(timestamp);
        });
        const mainDataPromise = this.serviceBusService.getQueueDetails(queue).then((queueDetails) => {
            queueDetails.mostRecentDeadletter = null;
            this.setState({ queueData: queueDetails, receivedData: true });
        });

        Promise.all([deadletterTimePromise, mainDataPromise]).then(() => {
            this.setState((oldState) => {
                oldState.queueData.mostRecentDeadletter = retrievedDeadletterTimestamp;
                return oldState;
            });
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
                        endpointProperties={getQueueCrudProperties()}
                        endpointCrudService={new QueueCrudService()}
                    />
                ) : (
                    <Spinner size={50} />
                )
        );
    }
}