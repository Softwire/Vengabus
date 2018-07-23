import React, { Component } from 'react';
import { css } from 'react-emotion';
import {
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";

/** Required props:
 * @prop {string} propertyName Name of the property.
 * @prop {string} propertyValue Value of the property.
 * @prop {int} index To be able to identify its place.
 * @prop {function} getValidNameState Function that validates this input.
 * @prop {function} handlePropertyNameChange Function that is called when propertyName is edited.
 * @prop {function} handlePropertyValueChange Function that is called when propertyValue is edited.
 * @prop {function} deleteRow Function that is called when the delete button is pressed.
 */
export class MessagePropertyInputRow extends Component {
    constructor(props) {
        super(props);
    }

    FieldGroup({ id, validation, ...props }) {
        return (
            <FormGroup controlId={id} validationState={validation}>
                <FormControl {...props} />
            </FormGroup>
        );
    }

    render() {
        const formStyle = css`
            padding: 5px;
            width: 47%;
            color: white;
            float: left;
        `;
        const deleteButtonStyle = css`
            padding: 5px;
            width: 5%; 
            float: left;
        `;

        const index = this.props.index;

        return (
            <div>
                <form className={formStyle}>
                    <this.FieldGroup
                        id="formControlsText"
                        validation={this.props.getValidNameState(index)}
                        key={index}
                        type="text"
                        placeholder="Enter property name"
                        value={this.props.propertyName}
                        onChange={(event) => this.props.handlePropertyNameChange(event, index)}
                    />
                </form>
                <form className={formStyle}>
                    <this.FieldGroup
                        id="formControlsText"
                        key={index}
                        type="text"
                        placeholder="Enter property value"
                        value={this.props.propertyValue}
                        onChange={(event) => this.props.handlePropertyValueChange(event, index)}
                    />
                </form >
                <div className={deleteButtonStyle}>
                    <Button bsStyle="danger" onClick={() => this.props.deleteRow(index)}>Delete</Button>
                </div>
            </div>
        );
    }

}