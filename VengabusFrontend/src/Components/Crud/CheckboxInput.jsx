import React, { Component } from 'react';
import { css } from 'emotion';
import { Checkbox, Glyphicon, OverlayTrigger } from 'react-bootstrap';

/**
 * @prop {bool} data The data that is set by the checkbox.
 * @prop {string} text The name of the property that is being set by the checkbox.
 * @prop {node} tooltip The tooltip element that is displayed when hovering over the info glyphicon. If undefined then no info tooltip.
 * @prop {function} onChange The function that is called when the value of the checkbox is changed.
 */
export class CheckboxInput extends Component {

    render() {
        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;
        const glyphStyle = css`
            padding-left: 5px;
        `;
        const leftDivStyle = css`
            display: inline-block;
            vertical-align: middle;
            min-width: 150px;
        `;
        const rightDivStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-top: 2px;
        `;

        return (
            <div>
                <div className={leftDivStyle} >
                    {
                        this.props.tooltip ? (
                            <span className={leftAlign}>
                                {this.props.text}
                                <OverlayTrigger placement="right" overlay={this.props.tooltip}>
                                    <Glyphicon glyph="info-sign" className={glyphStyle} />
                                </OverlayTrigger>
                            </span>
                        ) : (
                                <span className={leftAlign}>{this.props.text}</span>
                            )
                    }
                </div>
                <div className={rightDivStyle} >
                    <Checkbox
                        className={leftAlign}
                        checked={this.props.data}
                        onChange={(event) => {
                            this.props.onChange(event.target.checked);
                        }}
                    />
                </div>
            </div>
        );
    }

}


