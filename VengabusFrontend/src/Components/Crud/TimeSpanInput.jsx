import React, { Component } from 'react';
import { css } from 'emotion';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

/**
 * @prop {function} onChange This will be called with the new time object when changes are made.
 * @prop {object} inputData Contains the specified timespan.
 * @property {number} inputData.days
 * @property {number} inputData.hours
 * @property {number} inputData.minutes
 * @property {number} inputData.seconds
 * @property {number} inputData.milliseconds
 */
export class TimeSpanInput extends Component {

    /**
     * @param {string} text Text to be displayed above the input.
     * @param {string} propertyName The key of the property belonging to this input.
     * @returns {node} The input field.
     */
    createFormGroupForTimeUnit = (text, propertyName) => {
        const inputStyle = css`
            width: 100px;
            float: left;
            padding-left: 5px;
        `;
        const labelStyle = css`
            font-weight: normal;
        `;
        return (
            <FormGroup className={inputStyle}>
                <ControlLabel className={labelStyle}>{text}</ControlLabel>
                <FormControl
                    type="number"
                    value={this.props.inputData[propertyName]}
                    placeholder={text}
                    onChange={(event) => this.props.onChange({ ...this.props.inputData, [propertyName]: parseInt(event.target.value, 10) })}
                />
            </FormGroup>
        );
    }

    render() {
        const formStyle = css`
            padding-left: 10px;
        `;
        const divStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-bottom: 10px;
        `;

        return (
            <div className={divStyle} >
                <form className={formStyle}>
                    {this.createFormGroupForTimeUnit('Days', 'days')}
                    {this.createFormGroupForTimeUnit('Hours', 'hours')}
                    {this.createFormGroupForTimeUnit('Minutes', 'minutes')}
                    {this.createFormGroupForTimeUnit('Seconds', 'seconds')}
                    {this.createFormGroupForTimeUnit('Milliseconds', 'milliseconds')}
                </form>
            </div>
        );
    }
}