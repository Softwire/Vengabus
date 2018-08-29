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
    isPropertyNameValid = (index) => {
        let name = this.props.properties[index].name;
        let occurencesInUserDefinedProperties = _(this.props.properties)
            .filter((current) => current.name === name)
            .size();
        let occurencesInPredefinedProperties = _(this.props.reservedPropertyNames)
            .filter((current) => current === name)
            .size();
        if (!name) {
            return false;
        }
        let isPropertyValid = true;
        if (occurencesInUserDefinedProperties > 1) {
            let newWarning = "Warning: repetitive property name: '" + name + "'";
            if (this.warnings.indexOf(newWarning) === -1) {
                this.warnings.push(newWarning);
            }
            isPropertyValid = false;
        }
        if (occurencesInPredefinedProperties > 0) {
            let newWarning = "Warning: custom property '" + name + "' is potentially a predefined property";
            if (this.warnings.indexOf(newWarning) === -1) {
                this.warnings.push(newWarning);
            }
            isPropertyValid = false;
        }
        return isPropertyValid;
    }

    render() {
        let inputs = [];
        this.warnings = [];
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
        }
        for (let i = 0; i < this.props.properties.length; i++) {
            inputs.push(
                <MessagePropertyInputRow
                    propertyName={this.props.properties[i].name}
                    propertyValue={this.props.properties[i].value}
                    index={i}
                    key={i}
                    isPropertyNameValid={(index) => this.isPropertyNameValid(index) ? null : 'error'}
                    handlePropertyNameChange={this.props.handlePropertyNameChange}
                    handlePropertyValueChange={this.props.handlePropertyValueChange}
                    deleteRow={this.props.deleteRow}
                    permittedValues={remainingPermittedValues}
                />
            );
        }

        if (this.props.reportWarnings) {
            this.props.reportWarnings(this.warnings);
        }

        return <div>{inputs}</div>;
    }

}
