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
            width: 150px;
        `;
        const leftDivStyle = css`
            display: inline-block;
            vertical-align: middle;
        `;
        const rightDivStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-top: 2px;
        `;
        const value = {
            value: this.props.data,
            label: this.props.data.toString()
        };

        return (
            <div>
                <div className={leftDivStyle} >
                    {
                        this.props.tooltip ? (
                            <span className={leftAlign}>
                                {this.props.text}
                                <OverlayTrigger placement="right" overlay={this.props.tooltip}>
                                    <Glyphicon glyph="info-sign" className={glyphStyle} />
                                </OverlayTrigger>
                            </span>
                        ) : (
                                <span className={leftAlign}>{this.props.text}</span>
                            )
                    }
                </div>
                <div className={rightDivStyle} >
                    <Select
                        className={classNames(leftAlign, selectStyle)}
                        options={this.props.options}
                        value={value}
                        onChange={(event) => this.props.onChange(event.value)}
                    />
                </div>
            </div>
        );
    }
}