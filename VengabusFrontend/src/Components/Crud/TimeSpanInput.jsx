import React, { Component } from 'react';
import { css } from 'emotion';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

/**
 * @prop {function} onChange This will be called with the new time object when changes are made.
 * @prop {object} data Contains the specified timespan.
 * @property {number} data.days
 * @property {number} data.hours
 * @property {number} data.minutes
 * @property {number} data.seconds
 * @property {number} data.milliseconds
 */
export class TimeSpanInput extends Component {

    render() {
        const inputStyle = css`
            width: 100px;
            float: left;
            padding-left: 5px;
        `;
        const formStyle = css`
            padding-left: 10px;
        `;
        const labelStyle = css`
            font-weight: normal;
        `;
        const divStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-bottom: 10px;
        `;

        return (
            <div className={divStyle} >
                <form className={formStyle}>
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