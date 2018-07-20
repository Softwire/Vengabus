import React, { Component } from 'react';
import { css } from 'react-emotion';
import {
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";


export class MessagePropertyInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            propertyNames: ["test1", "test2"],
            propertyValues: ["t1", "t2"]
        };
    }

    FieldGroup({ id, validation, ...props }) {
        return (
            <FormGroup controlId={id} validationState={validation}>
                <FormControl {...props} />
            </FormGroup>
        );
    }

    handlePropertyNameChange = (event, position) => {
        let newPropertyNames = this.state.propertyNames;
        newPropertyNames[position] = event.target.value;
        this.setState({ propertyNames: newPropertyNames });
    };

    handlePropertyValueChange = (event, position) => {
        let newPropertyValues = this.state.propertyValues;
        newPropertyValues[position] = event.target.value;
        this.setState({ propertyValues: newPropertyValues });
    };

    addNewProperty = () => {
        let newPropertyValues = this.state.propertyValues;
        newPropertyValues[newPropertyValues.length] = "";
        let newPropertyNames = this.state.propertyNames;
        newPropertyNames[newPropertyNames.length] = "";
        this.setState({
            propertyValues: newPropertyValues,
            propertyNames: newPropertyNames
        });
    }

    submit = () => {
        let properties = {};
        for (let i = 0; i < this.state.propertyNames.length; i++) {
            const propertyNames = this.state.propertyNames;
            const propertyValues = this.state.propertyValues;
            if (propertyNames[i] && propertyValues[i] && !properties.hasOwnProperty(propertyNames[i])) {
                //Prevent the user from inputting reserved property names
                if (propertyNames[i] !== 'body' && propertyNames[i] !== 'queuename' && propertyNames[i] !== 'SAS') {
                    properties[propertyNames[i]] = propertyValues[i];
                }
            }
        }
        this.props.submitMessage(properties);
    }



    getValidNameState(i) {
        let name = this.state.propertyNames[i];
        if (name === 'body' || name === 'queuename' || name === 'SAS' || name.length === 0) {
            return 'error';
        } else {
            return null;
        }
    }

    render() {
        const formStyle = css`
            padding: 5px;
            width: 50%;
            color: white;
            float: left;
        `;
        let propertyNamesInputs = [];
        let propertyValuesInputs = [];
        for (let i = 0; i < this.state.propertyNames.length; i++) {
            propertyNamesInputs[i] = (
                <this.FieldGroup
                    id="formControlsText"
                    validation={this.getValidNameState(i)}
                    key={i}
                    type="text"
                    placeholder="Enter property name"
                    value={this.state.propertyNames[i]}
                    onChange={(event) => this.handlePropertyNameChange(event, i)}
                />);
            propertyValuesInputs[i] = (
                <this.FieldGroup
                    id="formControlsText"
                    key={i}
                    type="text"
                    placeholder="Enter property value"
                    value={this.state.propertyValues[i]}
                    onChange={(event) => this.handlePropertyValueChange(event, i)}
                />);
        }

        return (
            <div>
                <form className={formStyle}>
                    {propertyNamesInputs}
                </form>
                <form className={formStyle}>
                    {propertyValuesInputs}
                </form >
                <form className={formStyle}>
                    <Button
                        id="addNewPropertyButton"
                        onClick={this.addNewProperty}
                    >
                        Add New Property
                    </Button>
                </form>
                <form className={formStyle}>
                    <Button
                        id="submitButton"
                        onClick={this.submit}
                    >
                        Submit
                    </Button>
                </form>
            </div >
        );
    }

}
