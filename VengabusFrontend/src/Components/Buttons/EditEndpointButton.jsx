import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { pageSwitcher, PAGES } from '../../Pages/PageSwitcherService';
import { EndpointTypes } from '../../Helpers/EndpointTypes';

/* eslint-disable react/no-multi-comp */

/**
 * @prop {string} endpointType
 * @prop {string} selectedEndpoint
 * @prop {string} parentTopic
 */
export class EditEndpointButton extends Component {
    render() {
        if (!this.props.endpointType) { throw new Error('type of the selected endpoint must be defined'); }
        if (!this.props.selectedEndpoint) { throw new Error('name of the selected endpoint must be defined'); }
        if (this.props.endpointType === EndpointTypes.SUBSCRIPTION && !this.props.parentTopic) {
            throw new Error('for endpoint types of subscription parentTopic is a required prop');
        }
        return (
            <Button
                bsSize='xsmall'
                aria-label="Edit"
                onClick={() =>
                    pageSwitcher.switchToPage(
                        PAGES.CrudPage,
                        {
                            endpointType: this.props.endpointType,
                            selectedEndpoint: this.props.selectedEndpoint,
                            parentTopic: this.props.parentTopic
                        }
                    )}
            >
                <Glyphicon glyph="pencil" />
            </Button>
        );
    }
}

/**
 * @prop {string} queueName
 */
export class EditQueueButton extends Component {
    render() {
        return (
            <EditEndpointButton endpointType={EndpointTypes.QUEUE} selectedEndpoint={this.props.queueName} />
        );
    }
}

/**
 * @prop {string} topicName
 */
export class EditTopicButton extends Component {
    render() {
        return (
            <EditEndpointButton endpointType={EndpointTypes.TOPIC} selectedEndpoint={this.props.topicName} />
        );
    }
}

/**
 * @prop {string} subscriptionName
 * @prop {string} parentTopic
 */
export class EditSubscriptionButton extends Component {
    render() {
        return (
            <EditEndpointButton endpointType={EndpointTypes.SUBSCRIPTION} selectedEndpoint={this.props.subscriptionName} parentTopic={this.props.parentTopic} />
        );
    }
}