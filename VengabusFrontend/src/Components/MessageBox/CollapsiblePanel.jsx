import React, { Component } from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import { css } from 'emotion';
import { sharedSizesAndDimensions } from '../../Helpers/SharedSizesAndDimensions';

export class CollapsiblePanel extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            panellsOpen: this.props.isDefaultExpanded
        };
    }

    togglePanel = () => {
        this.setState({
            panellsOpen: !this.state.panellsOpen
        });
    }

    render() {
        const collapsiblePanelStyle = css`
            pre {
                background-color: white;
              
            }
            pre p {
                margin: 0;
            }
            
        `;
        const headerStyle = css`
            font-weight: bold;
            display: inline-block;
        `;
        const glyphiconStyle = css` /*we need the margins below to align the plus and minus glyphicons*/
            &.glyphicon-plus {
                margin-left: 1px;
                margin-right: calc(${sharedSizesAndDimensions.GLYPHICON_HORIZONTAL_MARGINS}px - 1px);
            }
            &.glyphicon-minus {
                margin-right: ${sharedSizesAndDimensions.GLYPHICON_HORIZONTAL_MARGINS}px;
            }
        `;
        return (
            <Panel defaultExpanded={this.props.isDefaultExpanded} className={collapsiblePanelStyle} onToggle={() => this.togglePanel()} >
                <Panel.Toggle>
                    <Panel.Heading>
                        <Panel.Title>
                            <Glyphicon glyph={this.state.panellsOpen ? 'minus' : 'plus'} className={glyphiconStyle} /><h4 className={headerStyle}>{this.props.panelTitle}</h4>
                        </Panel.Title>
                    </Panel.Heading>
                </Panel.Toggle>
                <Panel.Collapse>
                    <Panel.Body>{this.props.children}</Panel.Body>
                </Panel.Collapse>
            </Panel >

        );
    }

}