import React, { Component } from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import { css } from 'emotion';
import { panelDarkGrey, panelLightGrey, panelWhiteGrey } from '../colourScheme';

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
        const panelStyle = css`
            .panel {
                margin-bottom: 10px;
            }
            .panel-heading {
                padding: 0 15px;
                color: ${panelDarkGrey};
                background-color: ${panelWhiteGrey};
                border-color: ${panelLightGrey};
            }
            .panel-body { 
                padding: 0;
            }
            pre {
                background-color: white;
                border: none;
                margin: 0;
            }
            pre p {
                margin: 0;
            }
            
        `;
        const headerStyle = css`
            font-weight: bold;
            display: inline-block;
        `;
        const glyphiconStyle = css`
            &.glyphicon-plus {
                margin-left: 1px;
                margin-right: 10px;
            }
            &.glyphicon-minus {
                margin-right: 11px;
            }
        `;
        return (
            <Panel defaultExpanded={this.props.isDefaultExpanded} className={panelStyle} onToggle={() => this.togglePanel()} >
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