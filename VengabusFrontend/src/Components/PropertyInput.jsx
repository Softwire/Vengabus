import React, { Component } from 'react';
import { CheckboxInput } from './CheckboxInput';
import { NumberInput } from './NumberInput';


/**
 * @prop {string} text Text to be displayed for the input.
 * @prop {unknown} data Data modified by the input. Types boolean and object are supported.
 * @prop {node} tooltip JSX element to be displayed when hovering over the info glyphicon. If undefined then no glyphicon.
 * @prop {function} onChange Function called when the value is changed.
 * @prop {Object <string, {label: string, value: any}>[]} options Only relevant if component type is Select. Format of the object is {label: display name, value: associated value}
 * @prop {class} componentType If type of data is object then type of input component will be determined by this.
 */
export class PropertyInput extends Component {

    render() {
        const dataType = typeof this.props.data;
        const propsToPass = { ...this.props };
        const ComponentType = this.props.componentType;
        delete propsToPass.componentType;
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
                if (!ComponentType) { throw new Error(`for data types of string component type must be defined (in ${this.props.text})`); }
                return (
                    <ComponentType
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