import React, { Component } from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import { css } from 'emotion';
import { sharedSizesAndDimensions } from '../../Helpers/SharedSizesAndDimensions';
import { panelMediumGrey } from '../../colourScheme';

export class NoPropertiesPanel extends Component {

    render() {
        const noPropertiesPanelStyle = css`
            .panel-heading pre {
                float: right;
                margin-right: 10px;
                padding: 10px; /*to align the no properties text with the h4 title*/
                background: transparent;
            }
        `;
        const headerStyle = css`
            font-weight: bold;
            display: inline-block;
        `;
        const glyphiconStyle = css` /*we need the margins below to align with the minus glyphicon in CollapsiblePanel*/
            &.glyphicon-plus {
                margin-left: 1px;
                margin-right: calc(${sharedSizesAndDimensions.GLYPHICON_HORIZONTAL_MARGINS}px - 1px);
                color: ${panelMediumGrey};
            }
        `;
        return (
            <Panel className={noPropertiesPanelStyle} >
                <Panel.Heading>
                    <Panel.Title >
                        <Glyphicon glyph={'plus'} className={glyphiconStyle} />
                        <h4 className={headerStyle}>{this.props.panelTitle}</h4>
                        <pre>{`There are no properties to display`}</pre>
                    </Panel.Title>
                </Panel.Heading>
            </Panel >

        );
    }

}