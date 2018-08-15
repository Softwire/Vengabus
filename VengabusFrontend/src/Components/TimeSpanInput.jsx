import React, { Component } from 'react';
import { css } from 'emotion';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    OverlayTrigger,
    Glyphicon
} from "react-bootstrap";

/**
 * @prop {string} text The name of the property being modified.
 * @prop {node} tooltip The tooltip to be displayed when hovering over the info glyphicon. If undefined then no glyphicon.
 * @prop {function} onChange This will be called with the new time object when changes are made.
 * @prop {object} data Contains the specified timespan.
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
                            value={this.props.data.days}
                            placeholder="Enter Days"
                            onChange={(event) => this.props.onChange({ ...this.props.data, days: parseInt(event.target.value, 10) })}
                        />
                    </FormGroup>
                    <FormGroup className={inputStyle}>
                        <ControlLabel className={labelStyle}>Hours</ControlLabel>
                        <FormControl
                            type="number"
                            value={this.props.data.hours}
                            placeholder="Enter Hours"
                            onChange={(event) => this.props.onChange({ ...this.props.data, hours: parseInt(event.target.value, 10) })}
                        />
                    </FormGroup>
                    <FormGroup className={inputStyle}>
                        <ControlLabel className={labelStyle}>Minutes</ControlLabel>
                        <FormControl
                            type="number"
                            value={this.props.data.minutes}
                            placeholder="Enter Minutes"
                            onChange={(event) => this.props.onChange({ ...this.props.data, minutes: parseInt(event.target.value, 10) })}
                        />
                    </FormGroup>
                    <FormGroup className={inputStyle}>
                        <ControlLabel className={labelStyle}>Seconds</ControlLabel>
                        <FormControl
                            type="number"
                            value={this.props.data.seconds}
                            placeholder="Enter Seconds"
                            onChange={(event) => this.props.onChange({ ...this.props.data, seconds: parseInt(event.target.value, 10) })}
                        />
                    </FormGroup>
                    <FormGroup className={inputStyle}>
                        <ControlLabel className={labelStyle}>Milliseconds</ControlLabel>
                        <FormControl
                            type="number"
                            value={this.props.data.milliseconds}
                            placeholder="Enter Milliseconds"
                            onChange={(event) => this.props.onChange({ ...this.props.data, milliseconds: parseInt(event.target.value, 10) })}
                        />
                    </FormGroup>
                </form>
            </div>
        );
    }
}