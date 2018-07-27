import React, { Component } from 'react';
import { MessagePropertyInputRow } from './MessagePropertyInputRow';
import _ from 'lodash';

/** Renders a set of inputs (either dropdown or normal)
 * @prop {string[]} properties Contains all of the names and values of properties.
 * @prop {function} handlePropertyNameChange Called when a value in the left column is changed.
 * @prop {function} handlePropertyValueChange Called when a value in the right column is changed.
 * @prop {function} deleteRow Called when a delete button is pressed.
 * @prop {string[]} permittedValues Contains the values for the dropdown list. If unspecified, then any user input is accepted in the left column.
 */
export class MessagePropertyInput extends Component {

    /**
     * Checks whether the name of a user defined property is valid, i.e. neither empty nor a duplicate.
     * @param {integer} index The index of the name to check.
     * @return {string} 'error' if the name is invalid, or null otherwise.
     */
    isPropertyNameInvalid = (index) => {
        let name = this.props.properties[index].name;
        if (!name || _(this.props.properties)
            .filter((current) => current.name === name)
            .size() > 1) {
            return 'error';
        } else {
            return null;
        }
    }

    render() {
        let inputs = [];
        let remainingPermittedValues;
        if (this.props.permittedValues) {
            remainingPermittedValues = [...this.props.permittedValues];
        }
        for (let i = 0; i < this.props.properties.length; i++) {
            //Remove properties that have already been selected from the dropdown
            const indexOfExistingValue = remainingPermittedValues ? remainingPermittedValues.indexOf(this.props.properties[i].name) : -1;
            if (indexOfExistingValue !== -1) {
                remainingPermittedValues.splice(indexOfExistingValue, 1);
            }
            inputs.push(
                <MessagePropertyInputRow
                    propertyName={this.props.properties[i].name}
                    propertyValue={this.props.properties[i].value}
                    index={i}
                    key={i}
                    getValidNameState={this.isPropertyNameInvalid}
                    handlePropertyNameChange={this.props.handlePropertyNameChange}
                    handlePropertyValueChange={this.props.handlePropertyValueChange}
                    deleteRow={this.props.deleteRow}
                    permittedValues={remainingPermittedValues}
                />
            );
        }

        return <div>{inputs}</div>;
    }

}
