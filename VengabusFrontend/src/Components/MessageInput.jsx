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
 */
export class MessageInput extends Component {
    constructor(props) {
        super(props);

        this.permittedValues = ['MessageId', 'ContentType'];

        this.state = {
            messageBody: "",
            userDefinedProperties: [], //[{name: something, value: something}]
            preDefinedProperties: [] //[{name: something, value: something}]
        };

    }

    /**
     * Updates a user-defined property name or value in the state.
     * @param {integer} position The position of the property in the list.
     * @param {string} attribute The attribute of the property that has changed, 'name' or 'value' 
     * @param {string} newValue The new value of that attribute of the property.
     */
    handleUserDefinedPropertyChange = (position, attribute, newValue) => {
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
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
            [propertyType]: newProperties
        });
    }

    /**
     * Updates the message body in the state with a new value.
     * @param {string} newBody The new value of the body.
     */
    handleMessageBodyChange = newBody => {
        this.setState({ messageBody: newBody });
    };

    submit = () => {
        let properties = {};
        const userDefinedProperties = this.state.userDefinedProperties;
        for (let i = 0; i < this.state.userDefinedProperties.length; i++) {
            const thisPropertyName = userDefinedProperties[i].name;
            const thisPropertyValue = userDefinedProperties[i].value;
            //Prevent the user from inputting invalid property names.
            //Cannot use isPropertyNameInvalid here because if there are two properties with the same name it will mark
            //both of them as invalid whereas we just want to remove one of them.
            if (thisPropertyName && thisPropertyValue && !properties.hasOwnProperty(userDefinedProperties[i].name)) {
                if (thisPropertyName.length > 0) {
                    properties[thisPropertyName] = thisPropertyValue;
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
            padding-left: 5px;
            padding-top: 1%;
            width: 85%;
            height: 1080px;
            float: left;
        `;
        const buttonStyle = css`
            width: 270px;
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
                            Add new Azure property
                        </Button>
                    </div>
                </form>
                <hr />
                <div className={leftAlignContainerStyle}>
                    <p className={headingStyle}>User-defined Properties</p>
                </div>
                <MessagePropertyInput
                    properties={this.state.userDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.handleUserDefinedPropertyChange(index, 'name', newName)}
                    handlePropertyValueChange={(newVame, index) => this.handleUserDefinedPropertyChange(index, 'value', newVame)}
                    deleteRow={(index) => this.deleteRow(index, true)}
                />
                <form>
                    <div className={leftAlignContainerStyle}>
                        <Button
                            className={buttonStyle}
                            onClick={() => this.addNewProperty(true)}
                        >
                            Add new application specific property
                        </Button>
                    </div>
                </form>
                <hr />
                <form>
                    <FormGroup
                        className={leftAlignContainerStyle}
                        controlId="formControlsMessageBodyText"
                        onChange={(event) => this.handleMessageBodyChange(event.target.value)}
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
