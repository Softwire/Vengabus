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
            padding-bottom: 10px;
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
            </div>
        );
    }
}