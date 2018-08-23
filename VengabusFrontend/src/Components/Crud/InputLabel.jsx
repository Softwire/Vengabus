import React, { Component } from 'react';
import { css } from 'emotion';
import { OverlayTrigger, Glyphicon } from "react-bootstrap";

/**
 * @prop {string} text The name of the property that is being set by the input.
 * @prop {node} tooltip The tooltip element that is displayed when hovering over the info glyphicon. If undefined then no info tooltip.
 */
export class InputLabel extends Component {
    render() {
        const divStyle = css`
            display: inline-block;
            vertical-align: middle;
            min-width: 200px;
        `;
        const glyphStyle = css`
            padding-left: 5px;
        `;
        const spanStyle = css`
            text-align: left;
            padding-left: 15px;
        `;
        return (
            <div className={divStyle} >
                {
                    this.props.tooltip ?
                        (
                            <span className={spanStyle}>
                                {this.props.text}:
                                <OverlayTrigger placement="right" overlay={this.props.tooltip}>
                                    <Glyphicon glyph="info-sign" className={glyphStyle} />
                                </OverlayTrigger>
                            </span>
                        ) : (
                            <span className={spanStyle}>{this.props.text}:</span>
                        )
                }
            </div>
        );
    }
}