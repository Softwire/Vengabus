import React, { Component } from 'react';
import { css } from 'emotion';
import { OverlayTrigger, Glyphicon, Tooltip } from "react-bootstrap";

/**
 * @prop {string} propertyName  The name of the property that is being set by the input.
 * @prop {string} tooltipText The text inside the tooltip element that is displayed when hovering over the info glyphicon. If undefined then no info tooltip.
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

        const tooltipNode = this.props.tooltipText ? (
            <OverlayTrigger
                placement="right"
                overlay={<Tooltip id={this.props.propertyName + 'Tooltip'}>{this.props.tooltipText}</Tooltip>}
            >
                <Glyphicon glyph="info-sign" className={glyphStyle} />
            </OverlayTrigger>
        ) : null;

        return (
            <div className={divStyle} >
                <span className={spanStyle}>{this.props.propertyName  + ":"}{tooltipNode}</span>
            </div>
        );
    }
}