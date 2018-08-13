import React, { Component } from 'react';
import Select from 'react-select';
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
 * @property {number} time.miliseconds
 */
export class TimeInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <FormGroup controlId="connectionString">
                <ControlLabel>Years</ControlLabel>
                <FormControl
                    type="text"
                    value={this.state.time.years}
                    placeholder="Enter Years"
                    onChange={(event) => this.props.handleTimeChange({ ...this.props.time, years: event.value })}
                />
            </FormGroup>
        );
    }
}