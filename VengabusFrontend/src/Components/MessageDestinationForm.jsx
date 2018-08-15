import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessageDestination } from './MessageDestination';

export class MessageDestinationForm extends Component {

    renderMessageDestination = (isQueue) => {
        return (
            <MessageDestination
                destinationType={isQueue ? "Queue" : "Topic"}
                isSelected={this.props.recipientIsQueue === isQueue}
                handleRecipientTypeChange={this.props.handleRecipientTypeChange}
                availableDestinations={isQueue ? this.props.availableQueues : this.props.availableTopics}
                selectedDestination={isQueue ? this.props.selectedQueue : this.props.selectedTopic}
                handleDestinationChange={(destinationName) => this.props.handleDestinationChange(isQueue, destinationName)}
            />
        );
    }

    render() {
        const headingStyle = css`
            font-weight: bold;
            margin-left: 5px;
        `;
        const leftAlign = css`
            text-align:left;
        `;
        let queueSelection = this.renderMessageDestination(true);
        let topicSelection = this.renderMessageDestination(false);
        return (
            <React.Fragment>
                <div className={leftAlign}>
                    <p className={headingStyle}>Destination</p>
                </div>
                {queueSelection}
                {topicSelection}
            </React.Fragment>
        );
    }

};