import React, { Component } from 'react';
import { css } from 'emotion';
import { Checkbox } from 'react-bootstrap';

/**
 * @prop {bool} data The data that is set by the checkbox.
 * @prop {function} onChange The function that is called when the value of the checkbox is changed.
 */
export class CheckboxInput extends Component {

    render() {
        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;
        const divStyle = css`
            display: inline-block;
            vertical-align: middle;
            padding-top: 2px;
        `;

        return (
            <div className={divStyle} >
                <Checkbox
                    className={leftAlign}
                    checked={this.props.data}
                    onChange={(event) => {
                        this.props.onChange(event.target.checked);
                    }}
                />
            </div>
        );
    }

}


