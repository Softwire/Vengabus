import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Panel } from 'react-bootstrap';
import { blue } from '../../colourScheme';
import { sharedSizesAndDimensions } from '../../Helpers/SharedSizesAndDimensions';
export class ServiceBusInfoBox extends Component {

    render() {
        const infoBoxStyle = css`
            color: black;
            overflow-wrap: break-word;
            max-height: calc(100vh - 275px - ${sharedSizesAndDimensions.DEFAULT_HEADER_HEIGHT}px); /* 275 is roughly the height of the other components in the sidebar */
            overflow-y: auto;
        `;
        const headerColour = css`
            background: ${blue};
        `;
        return (
            <Panel>
                <Panel.Heading className={headerColour}>Connection String</Panel.Heading>
                <Panel.Body className={infoBoxStyle}>
                    <div>{`Connected to: ${this.props.connectionString.label || ' '}`}</div>
                    <div>{`Connection String: ${this.props.connectionString.value || ' '}`}</div>
                </Panel.Body>
            </Panel>
        );
    }
}
