import React, { Component } from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import { css } from 'emotion';

export class CollapsiblePanel extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            glyphicon: "plus"
        };
    }


    toggleGlyphicon = () => {
        this.setState({
            glyphicon: this.state.glyphicon === "plus" ? "minus" : "plus"
        });
    }

    render() {
        const panelStyle = css`
            .panel {
                margin-bottom: 10px;
            }
            .panel-heading {
                padding: 0 15px;
                color: #333;
                background-color: #f5f5f5;
                border-color: #ddd;
            }
            .panel-body { 
                padding: 0;
            }
            pre {
                background-color: #ffffff;
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
        const gylphiconStyle = css`
            margin-right: 10px;
        `;
        return (
            <Panel defaultExpanded={this.props.isDefaultExpanded} className={panelStyle} onToggle={() => this.toggleGlyphicon()} >
                <Panel.Toggle>
                    <Panel.Heading>
                        <Panel.Title >
                            <Glyphicon glyph={this.state.glyphicon} className={gylphiconStyle} /><h4 className={headerStyle}>{this.props.panelTitle}</h4>
                        </Panel.Title>
                    </Panel.Heading>
                </Panel.Toggle>
                <Panel.Collapse>
                    <Panel.Body>{this.props.panelContent}</Panel.Body>
                </Panel.Collapse>
            </Panel >

        );
    }

}