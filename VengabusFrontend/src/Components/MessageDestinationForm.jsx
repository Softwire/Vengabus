import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessageDestination } from './MessageDestination';

export class MessageDestinationForm extends Component {

    renderMessageDestination = (isQueue) => {
        return (
            <MessageDestination
                isDestinationQueue={isQueue}
                handleRecipientTypeChange={this.props.handleRecipientTypeChange}
                recipientIsQueue={this.props.recipientIsQueue}
                availableDestinations={isQueue ? this.props.availableQueues : this.props.availableTopics}
                selectedDestination={isQueue ? this.props.selectedQueue : this.props.selectedTopic}
                convertToValueLabel={this.props.convertToValueLabel}
                handleQueueOrTopicChange={this.props.handleQueueOrTopicChange}
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
        return (
            <React.Fragment>
                <div className={leftAlign}>
                    <p className={headingStyle}>Destination</p>
                </div>
                {this.renderMessageDestination(true)}
                {this.renderMessageDestination(false)}
            </React.Fragment>
        );
    }

};