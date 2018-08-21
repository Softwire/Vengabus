import React, { Component } from 'react';
import { css } from 'emotion';
import { OverlayTrigger, Glyphicon } from "react-bootstrap";
import Select from 'react-select';
import classNames from 'classnames';

/**
 * @prop {any} data The data that is set by the input, must be convertible to a string.
 * @prop {string} text The name of the property that is being set by the input.
 * @prop {node} tooltip The tooltip element that is displayed when hovering over the info glyphicon. If undefined then no info tooltip.
 * @prop {function} onChange The function that is called when the value of the input is changed.
 * @prop {Object <string, {label: string, value: any}>[]} options Contains permitted values of the dropdown.
 */
export class DropdownInput extends Component {

    render() {
        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;
        const glyphStyle = css`
            padding-left: 5px;
        `;
        const selectStyle = css`
            width: 20%;
        `;
        const value = {
            value: this.props.data,
            label: this.props.data.toString()
        };

        return (
            <div>
                {
                    this.props.tooltip ? (
                        <p className={leftAlign}>
                            {this.props.text}
                            <OverlayTrigger placement="right" overlay={this.props.tooltip}>
                                <Glyphicon glyph="info-sign" className={glyphStyle} />
                            </OverlayTrigger>
                        </p>
                    ) : (
                            <p className={leftAlign}>{this.props.text}</p>
                        )
                }
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