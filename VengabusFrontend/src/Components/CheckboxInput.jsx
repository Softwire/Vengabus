import React, { Component } from 'react';
import { css } from 'emotion';
import { Checkbox, Glyphicon, OverlayTrigger } from 'react-bootstrap';

/**
 * @prop {bool} data The data that is set by the checkbox.
 * @prop {node} tooltip The tooltip element that is displayed when hovering over the info glyphicon. If undefined then no info tooltip.
 * @prop {function} onChange The function that is called when the value of the checkbox is changed.
 * @prop {string} text The name of the property that is being set by the checkbox.
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

        return (
            <div>
                {
                    this.props.tooltip ? (
                        <p className={leftAlign}>
                            {this.props.text}
                            <OverlayTrigger placement="right" overlay={this.props.tooltip}>
                                <Glyphicon glyph="info-sign" className={glyphStyle} />
                            </OverlayTrigger>
                        </p>
                    ) : (
                            <p className={leftAlign}>{this.props.text}</p>
                        )
                }
                <Checkbox
                    className={leftAlign}
                    checked={this.props.data}
                    onChange={(event) => {
                        this.props.onChange(event.target.checked);
                    }}
                />
            </div>
        );
    }

}


