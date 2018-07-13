import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { css } from 'react-emotion';

export class ServiceBusInfoBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const InfoBox = css`
            color: black;
        `;
        return (
            <div className="InfoBox">
                <p>{this.props.info}</p>
            </div>
        );
    }
}
