import React, { Component } from 'react';
import { css } from 'react-emotion';
import {
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";
import Select from 'react-select';

/** Required props:
 * @prop {string} propertyName Name of the property.
 * @prop {string} propertyValue Value of the property.
 * @prop {int} index To be able to identify its place.
 * @prop {function} getValidNameState Function that validates this input.
 * @prop {function} handlePropertyNameChange Function that is called when propertyName is edited.
 * @prop {function} handlePropertyValueChange Function that is called when propertyValue is edited.
 * @prop {function} deleteRow Function that is called when the delete button is pressed.
 * @prop {string[]} permittedValues A list of property values that are allowed, if not present, any values will be allowed. 
 */
export class MessagePropertyInputRow extends Component {

    /**
     * Provides an easy way of creating a Bootstrap Form element. 
     * @param {string} id The id of the FormControl.
     * @param {string} validation The validationState of the FormGroup.
     * @param {*} props A list of props that will be passed to the form control.
     * @returns {FormGroup} A FormGroup containing a FormControl with the given props.
     */
    FieldGroup({ id, validation, ...props }) {
        return (
            <FormGroup controlId={id} validationState={validation}>
                <FormControl {...props} />
            </FormGroup>
        );
    }

    render() {
        const formNameStyle = css`
            padding-left: 0.25%;
            width: 20%;
            float: left;
        `;
        const formValueStyle = css`
            padding-left: 0.25%;
            width: 75%;
            float: left;
        `;
        const deleteButtonStyle = css`
            padding-left: 0.25%;
            width: 5%; 
            float: left;
        `;
        const inputHeightStyle = css`
            min-height: 38px;
        `;
        const leftAlign = css`
            text-align: left;
        `;
        const propertyName = this.props.propertyName;
        const index = this.props.index;
        const permittedValues = this.props.permittedValues;
        let permittedValueMenuItems;
        if (permittedValues) {
            permittedValueMenuItems = permittedValues.map((permittedValue) => { return { value: permittedValue, label: permittedValue }; });
        }

        return (
            <div>
                <form className={formNameStyle}>
                    {this.props.permittedValues ? (
                        <Select
                            className={leftAlign}
                            title="Choose a property"
                            key={propertyName + index}
                            id={`property-dropdown-${index}`}
                            options={permittedValueMenuItems}
                            value={propertyName ? { value: propertyName, label: propertyName } : undefined}
                            onChange={(event) => this.props.handlePropertyNameChange(event.value, index)}
                        />

                    ) : (
                            <this.FieldGroup
                                id="formControlsText"
                                className={inputHeightStyle}
                                validation={this.props.getValidNameState(index)}
                                key={index}
                                type="text"
                                placeholder="Enter property name"
                                value={propertyName}
                                onChange={(event) => this.props.handlePropertyNameChange(event.target.value, index)}
                            />
                        )
                    }
                </form>
                <form className={formValueStyle}>
                    <this.FieldGroup
                        id="formControlsText"
                        className={inputHeightStyle}
                        key={index}
                        type="text"
                        placeholder="Enter property value"
                        value={this.props.propertyValue}
                        onChange={(event) => this.props.handlePropertyValueChange(event.target.value, index)}
                    />
                </form >
                <div className={deleteButtonStyle}>
                    <Button
                        className={inputHeightStyle}
                        bsStyle="danger"
                        onClick={() => this.props.deleteRow(index)}
                    >
                        Delete
                    </Button>
                </div>
            </div >
        );
    }

}