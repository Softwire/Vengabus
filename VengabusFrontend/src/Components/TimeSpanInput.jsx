import React, { Component } from 'react';
import { css } from 'emotion';
import {
    FormGroup,
    FormControl,
    ControlLabel
} from "react-bootstrap";

/**
 * @prop {function} handleTimeChange This will be called with the new time object when changes are made.
 * @prop {object} time Contains the specified timespan. 
 * @property {number} time.years
 * @property {number} time.months
 * @property {number} time.days
 * @property {number} time.hours
 * @property {number} time.minutes
 * @property {number} time.seconds
 * @property {number} time.milliseconds
 */
export class TimeSpanInput extends Component {

    render() {
        const inputStyle = css`
            width: 14%;
            float: left;
            padding-left: 5px;
        `;
        const formStyle = css`
            padding-left: 10px;
        `;
        const labelStyle = css`
            font-weight: normal;
        `;

        return (
            <form className={formStyle}>
                {/* <FormGroup className={inputStyle}>
                    <ControlLabel className={labelStyle}>Years</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.props.time.years}
                        placeholder="Enter Years"
                        onChange={(event) => this.props.handleTimeChange({ ...this.props.time, years: parseInt(event.target.value, 10) })}
                    />
                </FormGroup>
                <FormGroup className={inputStyle}>
                    <ControlLabel className={labelStyle}>Months</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.props.time.months}
                        placeholder="Enter Months"
                        onChange={(event) => this.props.handleTimeChange({ ...this.props.time, months: parseInt(event.target.value, 10) })}
                    />
                </FormGroup> */}
                <FormGroup className={inputStyle}>
                    <ControlLabel className={labelStyle}>Days</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.props.time.days}
                        placeholder="Enter Days"
                        onChange={(event) => this.props.handleTimeChange({ ...this.props.time, days: parseInt(event.target.value, 10) })}
                    />
                </FormGroup>
                <FormGroup className={inputStyle}>
                    <ControlLabel className={labelStyle}>Hours</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.props.time.hours}
                        placeholder="Enter Hours"
                        onChange={(event) => this.props.handleTimeChange({ ...this.props.time, hours: parseInt(event.target.value, 10) })}
                    />
                </FormGroup>
                <FormGroup className={inputStyle}>
                    <ControlLabel className={labelStyle}>Minutes</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.props.time.minutes}
                        placeholder="Enter Minutes"
                        onChange={(event) => this.props.handleTimeChange({ ...this.props.time, minutes: parseInt(event.target.value, 10) })}
                    />
                </FormGroup>
                <FormGroup className={inputStyle}>
                    <ControlLabel className={labelStyle}>Seconds</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.props.time.seconds}
                        placeholder="Enter Seconds"
                        onChange={(event) => this.props.handleTimeChange({ ...this.props.time, seconds: parseInt(event.target.value, 10) })}
                    />
                </FormGroup>
                <FormGroup className={inputStyle}>
                    <ControlLabel className={labelStyle}>Milliseconds</ControlLabel>
                    <FormControl
                        type="number"
                        value={this.props.time.milliseconds}
                        placeholder="Enter Milliseconds"
                        onChange={(event) => this.props.handleTimeChange({ ...this.props.time, milliseconds: parseInt(event.target.value, 10) })}
                    />
                </FormGroup>
            </form>
        );
    }
}