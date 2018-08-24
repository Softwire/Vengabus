import React, { Component } from 'react';
import { css } from 'emotion';
import Select from 'react-select';
import classNames from 'classnames';

/**
 * @prop {any} inputData The data that is set by the input, must be convertible to a string.
 * @prop {function} onChange The function that is called when the value of the input is changed.
 * @prop {Object <string, {label: string, value: any}>[]} options Contains permitted values of the dropdown.
 */
export class DropdownInput extends Component {

    render() {
        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;
        const selectStyle = css`
            width: 150px;
        `;
        const divStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-top: 2px;
        `;
        const value = {
            value: this.props.inputData,
            label: this.props.inputData.toString()
        };

        return (
            <div className={divStyle} >
                <Select
                    className={classNames(leftAlign, selectStyle)}
                    options={this.props.options}
                    value={value}
                    onChange={(event) => this.props.onChange(event.value)}
                />
            </div>

        );
    }
}