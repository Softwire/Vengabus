import React, { Component } from 'react';
import { CheckboxInput } from './CheckboxInput';

/**
 * @prop {string} text Text to be displayed for the input.
 * @prop {unknown} data Data modified by the input. Types boolean and object are supported.
 * @prop {node} tooltip JSX element to be displayed when hovering over the info glyphicon. If undefined then no glyphicon.
 * @prop {function} onChange Function called when the value is changed.
 * @prop {class} componentType If type of data is object then type of input component will be determined by this.
 */
export class PropertyInput extends Component {

    render() {
        const data = this.props.data;
        switch (typeof data) {
            case 'boolean':
                return (
                    <CheckboxInput
                        text={this.props.text}
                        data={this.props.data}
                        tooltip={this.props.tooltip}
                        onChange={this.props.onChange}
                    />
                );
            case 'object':
                const ComponentType = this.props.componentType;
                if (!ComponentType) { throw new Error(`for data types of object component type must be defined (in ${this.props.text})`); }
                return (
                    <ComponentType
                        text={this.props.text}
                        data={this.props.data}
                        tooltip={this.props.tooltip}
                        onChange={this.props.onChange}
                    />
                );
            default:
                throw new Error('unexpected data type');
        }
    }
}