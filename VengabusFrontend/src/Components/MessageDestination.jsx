import React, { Component } from 'react';
import { css } from 'react-emotion';
import Select from 'react-select';
import classNames from 'classnames';

export class MessageDestination extends Component {

    /**
     * Converts a string to an object of the form:
     * `{value: "string", label: "string"}`
     * Used to add values to select elements.
     * @param {string} str The string to convert.
     * @returns {object} The created object.
     */
    convertToValueLabel = (str) => {
        return { value: str, label: str };
    }

    render() {
        const fullWidth = css`
            float: left;
            width: 100%;
        `;
        const dropdownStyle = css`
            float: left;
            width: 275px;
            text-align:left;
        `;
        const radioStyle = css`
            float: left;
            width: 20px;
            position:relative;
            top:9px;
        `;
        const selectionStyle = css`
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

        let isCurrentDestinationSelected = this.props.isDestinationQueue === this.props.recipientIsQueue;

        return (
            <div className={fullWidth}>
                <div
                    onClick={() => this.props.handleRecipientTypeChange(this.props.isDestinationQueue)}
                >
                    <input
                        type="radio"
                        id={(this.props.isDestinationQueue ? "queue" : "topic") + "-selection-radio"}
                        className={radioStyle}
                        checked={isCurrentDestinationSelected}
                        onChange={() => this.props.handleRecipientTypeChange(this.props.isDestinationQueue)}
                    />
                    <div className={classNames(leftAlign, selectionStyle, headingStyle, verticalAlign)}>
                        <p>{this.props.isDestinationQueue ? "Queue" : "Topic"}</p>
                    </div>
                </div>
                <Select
                    isDisabled={!isCurrentDestinationSelected}
                    className={dropdownStyle}
                    title={this.props.isDestinationQueue ? "Queue" : "Topic"}
                    id={(this.props.isDestinationQueue ? "queue" : "topic") + "-dropdown"}
                    options={this.props.availableDestinations}
                    value={this.props.selectedDestination ? this.convertToValueLabel(this.props.selectedDestination) : undefined}
                    onChange={(event) => this.props.handleQueueOrTopicChange(event.value)}
                />
            </div>
        );
    }

};