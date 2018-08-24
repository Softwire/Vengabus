import React, { Component } from 'react';
import { css } from 'emotion';
import { FormGroup, FormControl } from "react-bootstrap";

/**
 * @prop {number} inputData The data that is set by the input.
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
        const divStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-top: 15px;
        `;

        return (
            <div className={divStyle} >
                <form className={formStyle}>
                    <FormGroup className={inputStyle}>
                        <FormControl
                            type="number"
                            value={this.props.inputData}
                            placeholder="Enter Number"
                            onChange={(event) => this.props.onChange(parseInt(event.target.value, 10))}
                        />
                    </FormGroup>
                </form>
            </div>
        );
    }
}