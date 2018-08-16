import React, { Component } from 'react';
import { CheckboxInput } from './CheckboxInput';

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