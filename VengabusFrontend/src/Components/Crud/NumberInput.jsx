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
            width: 100px;
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
        const leftDivStyle = css`
            display: inline-block;
            vertical-align: middle;
        `;
        const rightDivStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-top: 15px;
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
            </div>
        );
    }
}