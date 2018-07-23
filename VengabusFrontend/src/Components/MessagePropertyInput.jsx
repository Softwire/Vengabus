import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Button } from "react-bootstrap";
import { MessagePropertyInputRow } from './MessagePropertyInputRow';


export class MessagePropertyInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            propertyNames: [],
            propertyValues: []
        };
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



    getValidNameState = (i) => {
        let name = this.state.propertyNames[i];
        if (name === 'body' || name === 'queuename' || name === 'SAS' || name.length === 0) {
            return 'error';
        } else {
            return null;
        }
    }

    deleteRow = (i) => {
        const newPropertyNames = this.state.propertyNames.slice();
        newPropertyNames.splice(i, 1);
        const newPropertyValues = this.state.propertyValues.slice();
        newPropertyValues.splice(i, 1);
        this.setState({
            propertyNames: newPropertyNames,
            propertyValues: newPropertyValues
        });
    }

    render() {
        let inputs = [];
        for (let i = 0; i < this.state.propertyNames.length; i++) {
            inputs.push(
                <MessagePropertyInputRow
                    propertyName={this.state.propertyNames[i]}
                    propertyValue={this.state.propertyValues[i]}
                    index={i}
                    getValidNameState={this.getValidNameState}
                    handlePropertyNameChange={this.handlePropertyNameChange}
                    handlePropertyValueChange={this.handlePropertyValueChange}
                    deleteRow={this.deleteRow}
                />
            );
        }

        return (
            <div>
                {inputs}
                <form>
                    <Button
                        id="addNewPropertyButton"
                        onClick={this.addNewProperty}
                    >
                        Add New Property
                     </Button>
                </form>
                <form>
                    <Button
                        id="submitButton"
                        onClick={this.submit}
                    >
                        Submit
                     </Button>
                </form>
            </div>
        );
    }

}
