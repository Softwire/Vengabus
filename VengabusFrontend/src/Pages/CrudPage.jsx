import React, { Component } from 'react';
import { QueueCrud } from '../Components/Crud/QueueCrud';
import { TopicCrud } from '../Components/Crud/TopicCrud';
import { SubscriptionCrud } from '../Components/Crud/SubscriptionCrud';
import { EndpointTypes } from '../Helpers/EndpointTypes';

/**
 * @prop {string} selectedEndpoint Name of the selected endpoint.
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {string} parentTopic The parent topic of the subscription being edited. Only required for subscriptions.
 */
export class CrudPage extends Component {

    render() {
        switch (this.props.endpointType) {
            case EndpointTypes.QUEUE:
                return <QueueCrud selectedQueue={this.props.selectedEndpoint} />;
            case EndpointTypes.TOPIC:
                return <TopicCrud selectedTopic={this.props.selectedEndpoint} />;
            case EndpointTypes.SUBSCRIPTION:
                return <SubscriptionCrud selectedSubscription={this.props.selectedEndpoint} parentTopic={this.props.parentTopic} />;
            default:
                throw new Error('unexpected endpoint type: ' + this.props.endpointType);
        }
    }
}
