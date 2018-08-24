import React, { Component } from 'react';
import { CheckboxInput } from './CheckboxInput';
import { NumberInput } from './NumberInput';
import { DropdownInput } from './DropdownInput';

/**
 * @prop {unknown} inputData Data modified by the input. Types boolean, string, number and object are supported.
 * @prop {function} onChange Function called when the value is changed.
 * @prop {Object <string, {label: string, value: any}>[]} options Only relevant if component type is Select. Format of the object is {label: display name, value: associated value}
 * @prop {class} complexInputComponentType If type of data is object then type of input component will be determined by this.
 */
export class PropertyInput extends Component {

    render() {
        const dataType = typeof this.props.inputData;
        const { complexInputComponentType: ComplexInputComponentType, ...propsToPass } = this.props;
        switch (dataType) {
            case 'boolean':
                return (
                    <CheckboxInput {...propsToPass} />
                );
            case 'number':
                return (
                    <NumberInput {...propsToPass} />
                );
            case 'string':
                // This is because we don't require a free text input anywhere. When the need arises this should be changed to accomodate that.
                if (!this.props.options) { throw new Error(`for data types of string options prop for the permitted values of the dropdown is required (in ${this.props.text})`); }
                return (
                    <DropdownInput {...propsToPass} />
                );
            case 'object':
                if (!ComplexInputComponentType) { throw new Error(`for data types of object component type must be defined (in ${this.props.text})`); }
                return (
                    <ComplexInputComponentType {...propsToPass} />
                );
            default:
                throw new Error('unexpected data type : ' + dataType);
        }
    }
}