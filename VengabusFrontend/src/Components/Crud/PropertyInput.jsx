import React, { Component } from 'react';
import { CheckboxInput } from './CheckboxInput';
import { NumberInput } from './NumberInput';
import { DropdownInput } from './DropdownInput';

/**
 * @prop {unknown} data Data modified by the input. Types boolean and object are supported.
 * @prop {function} onChange Function called when the value is changed.
 * @prop {Object <string, {label: string, value: any}>[]} options Only relevant if component type is Select. Format of the object is {label: display name, value: associated value}
 * @prop {class} componentType If type of data is object then type of input component will be determined by this.
 */
export class PropertyInput extends Component {

    render() {
        const dataType = typeof this.props.data;
        const propsToPass = { ...this.props };
        delete propsToPass.componentType;
        const ComponentType = this.props.componentType;
        switch (dataType) {
            case 'boolean':
                return (
                    <CheckboxInput
                        {...propsToPass}
                    />
                );
            case 'number':
                return (
                    <NumberInput
                        {...propsToPass}
                    />
                );
            case 'string':
                if (!this.props.options) { throw new Error(`for data types of string options prop for the permitted values of the dropdown is required (in ${this.props.text})`); }
                return (
                    <DropdownInput
                        {...propsToPass}
                    />
                );
            case 'object':
                if (!ComponentType) { throw new Error(`for data types of object component type must be defined (in ${this.props.text})`); }
                return (
                    <ComponentType
                        {...propsToPass}
                    />
                );
            default:
                throw new Error('unexpected data type : ' + dataType);
        }
    }
}