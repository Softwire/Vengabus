import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Button } from "react-bootstrap";
import { MessagePropertyInputRow } from './MessagePropertyInputRow';
import _ from 'lodash';

/** Renders a set of inputs (either dropdown or normal)
 * @prop {string[]} propertyNames Contains all of the values in the left column.
 * @prop {string[]} propertyValues Contains all of the values in the right column.
 * @prop {function} handlePropertyNameChange Called when a value in the left column is changed.
 * @prop {function} handlePropertyValueChange Called when a value in the right column is changed.
 * @prop {function} deleteRow Called when a delete button is pressed.
 * @prop {string[]} permittedValues Contains the values for the dropdown list. If unspecified, then any user input is accepted in the left column.
 */
export class MessagePropertyInput extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Checks whether the name of a user defined property is valid, i.e. not empty or a duplicate.
     * @param {integer} index The index of the name to check.
     * @return {string} 'error' if the name is invalid, or null otherwise.
     */
    isPropertyNameInvalid = (index) => {
        let name = this.props.propertyNames[index];
        if (name.length === 0 || _(this.props.propertyNames)
            .filter((current) => current === name)
            .size() > 1) {
            return 'error';
        } else {
            return null;
        }
    }

    render() {
        let inputs = [];
        for (let i = 0; i < this.props.propertyNames.length; i++) {
            inputs.push(
                <MessagePropertyInputRow
                    propertyName={this.props.propertyNames[i]}
                    propertyValue={this.props.propertyValues[i]}
                    index={i}
                    getValidNameState={this.isPropertyNameInvalid}
                    handlePropertyNameChange={this.props.handlePropertyNameChange}
                    handlePropertyValueChange={this.props.handlePropertyValueChange}
                    deleteRow={this.props.deleteRow}
                    permittedValues={this.props.permittedValues}
                />
            );
        }

        return <div>{inputs}</div>;
    }

}
