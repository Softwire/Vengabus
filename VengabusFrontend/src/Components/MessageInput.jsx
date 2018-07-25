import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessagePropertyInput } from './MessagePropertyInput';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    Panel
} from "react-bootstrap";

/**
 * Contains the entire UI for inputting a message.
 * Currently only logs the message when it is submitted.
 */
export class MessageInput extends Component {
    constructor(props) {
        super(props);

        this.permittedValues = ['MessageId', 'ContentType'];

        this.state = {
            messageBody: "",
            userDefinedProperties: {}, //{name: something, value: something}
            preDefinedProperties: {} //{name: something, value: something}
        };

    }

    // handlePropertyNameChange = (newName, position) => {
    //     common("propertyNames", newName, position);
    // };
    // handlePropertyValueChange = (newName, position) => {
    //     common("propertyValues", newName, position);
    // };

    // common = (propertyName, newName, position) => {
    //     let newPropertyNames = this.state[propertyName];
    //     newPropertyNames[position] = newName;
    //     const stateMutationObject = {};
    //     stateMutationObject[propertyName] = newPropertyNames;
    //     this.setState(stateMutationObject);
    // };

    /**
     * Updates a user-defined property name in the state with a new value.
     * @param {string} newName The new name of the property.
     * @param {integer} position The position of the property in the list.
     */
    handlePropertyNameChange = (newName, position) => {
        let newUserDefinedProperties = [...this.state.userDefinedProperties];
        newUserDefinedProperties[position].name = newName;
        this.setState({ userDefinedProperties: newUserDefinedProperties });
    };

    /**
     * Updates a pre-defined property name in the state with a new value.
     * @param {string} newName The new name of the property.
     * @param {integer} position The position of the property in the list.
     */
    handleDropdownNameChange = (newName, position) => {
        let newPreDefinedProperties = [...this.state.preDefinedProperties];
        newPreDefinedProperties[position].name = newName;
        this.setState({ preDefinedProperties: newPreDefinedProperties });
    };

    /**
     * Updates a user-defined property value in the state with a new value.
     * @param {string} newValue The new value of the property.
     * @param {integer} position The position of the property in the list.
     */
    handlePropertyValueChange = (newValue, position) => {
        let newUserDefinedProperties = [...this.state.userDefinedProperties];
        newUserDefinedProperties[position].value = newValue;
        this.setState({ userDefinedProperties: newUserDefinedProperties });
    };

    /**
     * Updates a pre-defined property value in the state with a new value.
     * @param {string} newValue The new value of the property.
     * @param {integer} position The position of the property in the list.
     */
    handleDropdownValueChange = (newValue, position) => {
        let newPreDefinedProperties = [...this.state.preDefinedProperties];
        newPreDefinedProperties[position].value = newValue;
        this.setState({ preDefinedProperties: newPreDefinedProperties });
    };

    /**
     * Adds a new property to the list of user-defined properties.
     */
    addNewProperty = () => {
        let newProperties = [...this.state.userDefinedProperties];
        newProperties.push({ name: "", value: "" });
        this.setState({
            userDefinedProperties: newProperties
        });
    }

    /**
     * Adds a new property to the list of pre-defined properties.
     */
    addNewDropdown = () => {
        let newProperties = [...this.state.preDefinedProperties];
        newProperties.push({ name: "", value: "" });
        this.setState({
            preDefinedProperties: newProperties
        });
    }

    /**
     * Deletes a row from the list of user defined properties.
     * @param {integer} index The index of the row to delete.
     */
    deleteRow = (index) => {
        const newUserDefinedProperties = [...this.state.userDefinedProperties];
        newUserDefinedProperties.splice(index, 1);
        this.setState({
            userDefinedProperties: newUserDefinedProperties
        });
    }

    /**
     * Deletes a row from the list of predefined properties.
     * @param {integer} index The index of the row to delete.
     */
    deleteDropdownRow = (index) => {
        const newPreDefinedProperties = [...this.state.preDefinedProperties];
        newPreDefinedProperties.splice(index, 1);
        this.setState({
            preDefinedProperties: newPreDefinedProperties
        });
    }

    /**
     * Updates the message body in the state with a new value.
     * @param {string} newBody The new value of the body.
     */
    handleMessagebodyChange = newBody => {
        this.setState({ messageBody: newBody });
    };

    submit = () => {
        let properties = {};
        for (let i = 0; i < this.state.userDefinedProperties.length; i++) {
            const userDefinedProperties = this.state.userDefinedProperties;
            //Prevent the user from inputting invalid property names.
            //Cannot use isPropertyNameInvalid here because if there are two properties with the same name it will mark
            //both of them as invalid whereas we just want to remove one of them.
            if (userDefinedProperties[i].name && userDefinedProperties[i].value && !properties.hasOwnProperty(userDefinedProperties[i])) {
                if (userDefinedProperties[i].name.length > 0) {
                    properties[userDefinedProperties[i].name] = userDefinedProperties[i].value;
                }
            }
        }
        let message = {};
        for (let i = 0; i < this.state.preDefinedProperties.length; i++) {
            const preDefinedProperties = this.state.preDefinedProperties;
            //Prevent the user from inputting invalid property names.
            //Cannot use isPropertyNameInvalid here because if there are two properties with the same name it will mark
            //both of them as invalid whereas we just want to remove one of them.
            if (preDefinedProperties[i].name && preDefinedProperties[i].value && !message.hasOwnProperty(preDefinedProperties[i].name)) {
                if (preDefinedProperties[i].name.length > 0) {
                    message[preDefinedProperties[i].name] = preDefinedProperties[i].value;
                }
            }
        }
        message.MessageProperties = properties;
        message.MessageBody = this.state.messageBody;
        console.log(message);
    }

    render() {
        const formStyle = css`
            padding: 5px;
            width: 85%;
            height: 1080px;
            float: left;
        `;
        return (
            <div className={formStyle}>
                <MessagePropertyInput
                    properties={this.state.userDefinedProperties}
                    handlePropertyNameChange={this.handlePropertyNameChange}
                    handlePropertyValueChange={this.handlePropertyValueChange}
                    deleteRow={this.deleteRow}
                />
                <form>
                    <Button
                        onClick={this.addNewProperty}
                    >
                        Add new property
                    </Button>
                </form>
                <MessagePropertyInput
                    properties={this.state.preDefinedProperties}
                    handlePropertyNameChange={this.handleDropdownNameChange}
                    handlePropertyValueChange={this.handleDropdownValueChange}
                    deleteRow={this.deleteDropdownRow}
                    permittedValues={this.permittedValues}
                />
                <form>
                    <Button
                        onClick={this.addNewDropdown}
                        disabled={this.state.preDefinedProperties.length === this.permittedValues.length}
                    >
                        Add new dropdown
                    </Button>
                </form>
                <form>
                    <FormGroup controlId="formControlsMessageBodyText" onChange={(event) => this.handleMessagebodyChange(event.target.value)}>
                        <ControlLabel>Body</ControlLabel>
                        <FormControl componentClass="textarea" placeholder="Enter message body" />
                    </FormGroup>
                </form>
                <form>
                    <Button
                        onClick={this.submit}
                    >
                        Submit
                    </Button>
                </form>
            </div >
        );
    }

}
