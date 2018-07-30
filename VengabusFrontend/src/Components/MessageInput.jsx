import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessagePropertyInput } from './MessagePropertyInput';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button
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

    /**
     * Updates a user-defined property name or value in the state.
     * @param {string} attribute The attribute of the property that has changed, 'name' or 'value' 
     * @param {string} newValue The new value of that attribute of the property.
     * @param {integer} position The position of the property in the list.
     */
    handleUserDefinedPropertyChange = (attribute, newValue, position) => {
        let newUserDefinedProperties = [...this.state.userDefinedProperties];
        newUserDefinedProperties[position][attribute] = newValue;
        this.setState({ userDefinedProperties: newUserDefinedProperties });
    };

    /**
 * Updates a pre-defined property name or value in the state.
 * @param {string} attribute The attribute of the property that has changed, 'name' or 'value' 
 * @param {string} newValue The new value of that attribute of the property.
 * @param {integer} position The position of the property in the list.
 */
    handlePreDefinedPropertyChange = (attribute, newValue, position) => {
        let newPreDefinedProperties = [...this.state.preDefinedProperties];
        newPreDefinedProperties[position][attribute] = newValue;
        this.setState({ preDefinedProperties: newPreDefinedProperties });
    };

    /**
     * Adds a new property to the list of user-defined properties.
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     */
    addNewProperty = (isUserDefined) => {
        const propertyType = isUserDefined ? "userDefinedProperties" : "preDefinedProperties";
        let newProperties = [...this.state[propertyType]];
        newProperties.push({ name: "", value: "" });
        this.setState({
            [propertyType]: newProperties
        });
    }

    /**
     * Deletes a row from the list of user defined properties.
     * @param {integer} index The index of the row to delete.
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     */
    deleteRow = (index, isUserDefined) => {
        const propertyType = isUserDefined ? "userDefinedProperties" : "preDefinedProperties";
        const newProperties = [...this.state[propertyType]];
        newProperties.splice(index, 1);
        this.setState({
            [propertyType]: newProperties
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
            //No need to prevent invalid property names for pre-defined properties as it is not possible to enter an invalid name.
            message[preDefinedProperties[i].name] = preDefinedProperties[i].value;
        }
        message.MessageProperties = properties;
        message.MessageBody = this.state.messageBody;
        console.log(message);
    }

    render() {
        const formStyle = css`
            padding-left: 0.5%;
            padding-top: 1%;
            width: 85%;
            height: 1080px;
            float: left;
        `;
        const buttonStyle = css`
            width: 150px;
            margin-left: 5px;
        `;
        const headingStyle = css`
            font-weight: bold;
            margin-left: 5px;
        `;
        const leftAlignContainerStyle = css`
            text-align:left;
        `;
        const bodyStyle = css`
            min-height: 350px;
            margin-left: 5px;
        `;
        return (
            <div className={formStyle}>
                <div className={leftAlignContainerStyle}>
                    <p className={headingStyle}>User-defined Properties</p>
                </div>
                <MessagePropertyInput
                    properties={this.state.userDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.handleUserDefinedPropertyChange('name', newName, index)}
                    handlePropertyValueChange={(newVame, index) => this.handleUserDefinedPropertyChange('value', newVame, index)}
                    deleteRow={(index) => this.deleteRow(index, true)}
                />
                <form>
                    <div className={leftAlignContainerStyle}>
                        <Button
                            className={buttonStyle}
                            onClick={() => this.addNewProperty(true)}
                        >
                            Add new property
                        </Button>
                    </div>
                </form>
                <hr />
                <div className={leftAlignContainerStyle}>
                    <p className={headingStyle}>Pre-defined Properties</p>
                </div>
                <MessagePropertyInput
                    properties={this.state.preDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.handlePreDefinedPropertyChange('name', newName, index)}
                    handlePropertyValueChange={(newVame, index) => this.handlePreDefinedPropertyChange('value', newVame, index)}
                    deleteRow={(index) => this.deleteRow(index, false)}
                    permittedValues={this.permittedValues}
                />
                <form>
                    <div className={leftAlignContainerStyle}>
                        <Button
                            className={buttonStyle}
                            onClick={() => this.addNewProperty(false)}
                            disabled={this.state.preDefinedProperties.length === this.permittedValues.length}
                        >
                            Add new dropdown
                        </Button>
                    </div>
                </form>
                <hr />
                <form>
                    <FormGroup
                        className={leftAlignContainerStyle}
                        controlId="formControlsMessageBodyText"
                        onChange={(event) => this.handleMessagebodyChange(event.target.value)}
                    >
                        <ControlLabel className={headingStyle}>Body</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            placeholder="Enter message body"
                            className={bodyStyle}
                        />
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
