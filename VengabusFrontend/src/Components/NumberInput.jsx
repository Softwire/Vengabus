import React, { Component } from 'react';
import { css } from 'emotion';
import {
    FormGroup,
    FormControl,
    OverlayTrigger,
    Glyphicon
} from "react-bootstrap";

/**
 * @prop {number} data The data that is set by the input.
 * @prop {string} text The name of the property that is being set by the input.
 * @prop {node} tooltip The tooltip element that is displayed when hovering over the info glyphicon. If undefined then no info tooltip.
 * @prop {function} onChange The function that is called when the value of the input is changed.
 */
export class NumberInput extends Component {

    render() {
        const inputStyle = css`
            width: 14%;
            float: left;
            padding-left: 5px;
        `;
        const formStyle = css`
            padding-left: 10px;
        `;
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
                <form className={formStyle}>
                    <FormGroup className={inputStyle}>
                        <FormControl
                            type="number"
                            value={this.props.data}
                            placeholder="Enter Number"
                            onChange={(event) => this.props.onChange(parseInt(event.target.value, 10))}
                        />
                    </FormGroup>
                </form>
            </div>
        );
    }
}