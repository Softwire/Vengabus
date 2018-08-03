import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Panel } from 'react-bootstrap';
import { blue } from '../colourScheme';
import { sharedSizesAndDimensions } from '../Helpers/SharedSizesAndDimensions';
export class ServiceBusInfoBox extends Component {

    render() {
        const infoBoxStyle = css`
            --header-height: ${sharedSizesAndDimensions.DEFAULTHEADERHEIGHT};
            color: black;
            overflow-wrap: break-word;
            max-height: calc(100vh - 275px - var(--header-height)); /* 275 is roughly the height of the other components in the sidebar */
            overflow-y: auto;
        `;
        const headerColour = css`
            background: ${blue};
        `;
        return (
            <Panel>
                <Panel.Heading className={headerColour}>ServiceBus Details</Panel.Heading>
                <Panel.Body className={infoBoxStyle}>
                    <div>{`Your Connection string: ${this.props.connStringVal || ' '}`}</div>
                    <div>{`Name: ${this.props.info.name || ' '}`}</div>
                    <div>{`Location: ${this.props.info.location || ' '}`}</div>
                    <div>{`Status: ${this.props.info.status || ' '}`}</div>
                    <div>{`Permissions: ${this.props.info.permission || ' '}`}</div>
                </Panel.Body>
            </Panel>
        );
    }
}
