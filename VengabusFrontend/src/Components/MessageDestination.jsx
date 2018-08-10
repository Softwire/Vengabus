import React, { Component } from 'react';
import { css } from 'react-emotion';
import Select from 'react-select';
import classNames from 'classnames';

export class MessageDestination extends Component {
    render() {
        const fullWidth = css`
            float: left;
            width: 100%;
        `;
        const queueOrTopicSelectionDropdownStyle = css`
            float: left;
            width: 275px;
            text-align:left;
        `;
        const queueOrTopicSelectionRadioStyle = css`
            float: left;
            width: 20px;
            position:relative;
            top:9px;
        `;
        const queueOrTopicSelectionStyle = css`
            float: left;
            width: 75px;
        `;
        const headingStyle = css`
            font-weight: bold;
            margin-left: 5px;
        `;
        const leftAlign = css`
            text-align:left;
        `;
        const verticalAlign = css`
            line-height: 38px;
        `;
        return (
            <div className={fullWidth}>
                <div
                    onClick={() => this.props.handleRecipientTypeChange(this.props.isDestinationQueue)}
                >
                    <input
                        id={(this.props.isDestinationQueue ? "queue" : "topic") + "-selection-radio"}
                        className={queueOrTopicSelectionRadioStyle}
                        type="radio"
                        value={(this.props.isDestinationQueue ? "queue" : "topic")}
                        checked={this.props.isDestinationQueue === this.props.recipientIsQueue}
                        onChange={() => this.props.handleRecipientTypeChange(this.props.isDestinationQueue)}
                    />
                    <div className={classNames(leftAlign, queueOrTopicSelectionStyle, headingStyle, verticalAlign)}>
                        <p>{this.props.isDestinationQueue ? "Queue" : "Topic"}</p>
                    </div>
                </div>
                <Select
                    isDisabled={this.props.isDestinationQueue !== this.props.recipientIsQueue}
                    className={queueOrTopicSelectionDropdownStyle}
                    title={this.props.isDestinationQueue ? "Queue" : "Topic"}
                    id={(this.props.isDestinationQueue ? "queue" : "topic") + "-dropdown"}
                    options={this.props.availableDestinations}
                    value={this.props.selectedDestination ? this.props.convertToValueLabel(this.props.selectedDestination) : undefined}
                    onChange={(event) => this.props.handleQueueOrTopicChange(event.value)}
                />
            </div>
        );
    }

};