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
            propertyNames: [],
            propertyValues: [],
            propertyNamesDropdown: [],
            propertyValuesDropdown: []
        };

    }

    // handlePropertyNameChange = (newName, position) => {
    //     common("propertyNames", newName, position);
    // };
    // handlePropertyValueChange = (newName, position) => {
    //     common("propertyValues", newName, position);
    // };

    // common = (propertyName, newName, position) => {
    //     let newPropertyNames = this.props[propertyName];
    //     newPropertyNames[position] = newName;
    //     const stateMutationObject = {};
    //     stateMutationObject[propertyName] = newPropertyNames;
    //     this.setState(stateMutationObject);
    // };

    handlePropertyNameChange = (newName, position) => {
        let newPropertyNames = [...this.state.propertyNames];
        newPropertyNames[position] = newName;
        this.setState({ propertyNames: newPropertyNames });
    };


    handleDropdownNameChange = (newName, position) => {
        let newPropertyNamesDropdown = [...this.state.propertyNamesDropdown];
        newPropertyNamesDropdown[position] = newName;
        this.setState({ propertyNamesDropdown: newPropertyNamesDropdown });
    };

    handlePropertyValueChange = (event, position) => {
        let newPropertyValues = [...this.state.propertyValues];
        newPropertyValues[position] = event.target.value;
        this.setState({ propertyValues: newPropertyValues });
    };

    handleDropdownValueChange = (event, position) => {
        let newPropertyValuesDropdown = [...this.state.propertyValuesDropdown];
        newPropertyValuesDropdown[position] = event.target.value;
        this.setState({ propertyValuesDropdown: newPropertyValuesDropdown });
    };

    addNewProperty = () => {
        let newPropertyValues = [...this.state.propertyValues];
        newPropertyValues.push("");
        let newPropertyNames = [...this.state.propertyNames];
        newPropertyNames.push("");
        this.setState({
            propertyValues: newPropertyValues,
            propertyNames: newPropertyNames
        });
    }

    addNewDropdown = () => {
        let newPropertyValuesDropdown = [...this.state.propertyValuesDropdown];
        newPropertyValuesDropdown.push("");
        let newPropertyNamesDropdown = [...this.state.propertyNamesDropdown];
        newPropertyNamesDropdown.push("");
        this.setState({
            propertyValuesDropdown: newPropertyValuesDropdown,
            propertyNamesDropdown: newPropertyNamesDropdown
        });
    }

    /**
     * Deletes a row from the list of user defined properties.
     * @param {integer} index The index of the row to delete.
     */
    deleteRow = (index) => {
        const newPropertyNames = [...this.state.propertyNames];
        newPropertyNames.splice(index, 1);
        const newPropertyValues = [...this.state.propertyValues];
        newPropertyValues.splice(index, 1);
        this.setState({
            propertyNames: newPropertyNames,
            propertyValues: newPropertyValues
        });
    }

    // QQ LW MK
    // Rendering after deletion is buggy

    /**
     * Deletes a row from the list of predefined properties.
     * @param {integer} index The index of the row to delete.
     */
    deleteDropdownRow = (index) => {
        const newPropertyNamesDropdown = [...this.state.propertyNamesDropdown];
        newPropertyNamesDropdown.splice(index, 1);
        const newPropertyValuesDropdown = [...this.state.propertyValuesDropdown];
        newPropertyValuesDropdown.splice(index, 1);
        this.setState({
            propertyNamesDropdown: newPropertyNamesDropdown,
            propertyValuesDropdown: newPropertyValuesDropdown
        });
    }

    handleMessagebodyChange = event => {
        this.setState({ messageBody: event.target.value });
    };

    submit = () => {
        let properties = {};
        for (let i = 0; i < this.state.propertyNames.length; i++) {
            const propertyNames = this.state.propertyNames;
            const propertyValues = this.state.propertyValues;
            //Prevent the user from inputting invalid property names.
            //Cannot use isPropertyNameInvalid here because if there are two properties with the same name it will mark
            //both of them as invalid whereas we just want to remove one of them.
            if (propertyNames[i] && propertyValues[i] && !properties.hasOwnProperty(propertyNames[i])) {
                if (propertyNames[i].length > 0) {
                    properties[propertyNames[i]] = propertyValues[i];
                }
            }
        }
        let message = {};
        for (let i = 0; i < this.state.propertyNamesDropdown.length; i++) {
            const propertyNamesDropdown = this.state.propertyNamesDropdown;
            const propertyValuesDropdown = this.state.propertyValuesDropdown;
            //Prevent the user from inputting invalid property names.
            //Cannot use isPropertyNameInvalid here because if there are two properties with the same name it will mark
            //both of them as invalid whereas we just want to remove one of them.
            if (propertyNamesDropdown[i] && propertyValuesDropdown[i] && !message.hasOwnProperty(propertyNamesDropdown[i])) {
                if (propertyNamesDropdown[i].length > 0) {
                    message[propertyNamesDropdown[i]] = propertyValuesDropdown[i];
                }
            }
        }
        message.properties = properties;
        message.body = this.state.messageBody;
        console.table(message);
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
                    propertyNames={this.state.propertyNames}
                    propertyValues={this.state.propertyValues}
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
                    propertyNames={this.state.propertyNamesDropdown}
                    propertyValues={this.state.propertyValuesDropdown}
                    handlePropertyNameChange={this.handleDropdownNameChange}
                    handlePropertyValueChange={this.handleDropdownValueChange}
                    deleteRow={this.deleteDropdownRow}
                    permittedValues={['1', '2', '3', '4', '5']}
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
