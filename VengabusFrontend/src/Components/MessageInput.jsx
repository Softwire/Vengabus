import React, { Component } from 'react';
import { css } from 'react-emotion';
import { grey, blue } from '../colourScheme';
import { MessagePropertyInput } from './MessagePropertyInput';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    Panel
} from "react-bootstrap";

export class MessageInput extends Component {
    constructor(props) {
        super(props);

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

    handlePropertyNameChange = (newName, position) => {
        let newUserDefinedProperties = [...this.state.userDefinedProperties];
        newUserDefinedProperties[position].name = newName;
        this.setState({ userDefinedProperties: newUserDefinedProperties });
    };


    handleDropdownNameChange = (newName, position) => {
        let newPreDefinedProperties = [...this.state.preDefinedProperties];
        newPreDefinedProperties[position].name = newName;
        this.setState({ preDefinedProperties: newPreDefinedProperties });
    };

    handlePropertyValueChange = (event, position) => {
        let newUserDefinedProperties = [...this.state.userDefinedProperties];
        newUserDefinedProperties[position].value = event.target.value;
        this.setState({ userDefinedProperties: newUserDefinedProperties });
    };

    handleDropdownValueChange = (event, position) => {
        let newPreDefinedProperties = [...this.state.preDefinedProperties];
        newPreDefinedProperties[position].value = event.target.value;
        this.setState({ preDefinedProperties: newPreDefinedProperties });
    };

    addNewProperty = () => {
        let newProperties = [...this.state.userDefinedProperties];
        newProperties.push({ name: "", value: "" });
        this.setState({
            userDefinedProperties: newProperties
        });
    }

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


    // QQ LW MK
    // Rendering after deletion is buggy

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

    handleMessagebodyChange = event => {
        this.setState({ messageBody: event.target.value });
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
                    permittedValues={['MessageId', 'ContentType']}
                />
                <form>
                    <Button
                        onClick={this.addNewDropdown}
                    >
                        Add new dropdown
                    </Button>
                </form>
                <form>
                    <FormGroup controlId="formControlsMessageBodyText" onChange={this.handleMessagebodyChange}>
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
