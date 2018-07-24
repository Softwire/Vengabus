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

    handlePropertyNameChange = (newName, position) => {
        let newPropertyNames = this.state.propertyNames;
        newPropertyNames[position] = newName;
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
                if (this.getValidNameState(i)) {
                    properties[propertyNames[i]] = propertyValues[i];
                }
            }
        }
        this.props.submitMessage(properties);
    }


    /**
     * Chaks whether the name of a user defined property is valid, i.e. not ampty or a duplicate.
     * @param {integer} index The index of the name to check.
     * @return {string} 'error' if the name is invalid, or null otherwise.
     */
    getValidNameState = (index) => {
        let name = this.state.propertyNames[index];
        if (name.length === 0 || this.state.propertyNames.reduce(
            //Prevents duplicate entries
            function (n, val) {
                return n + (val === name);
            }, 0) > 1) {
            return 'error';
        } else {
            return null;
        }
    }

    /**
     * Deletes a row from the list of user defined properties.
     * @param {integer} index The index of the row to delete.
     */
    deleteRow = (index) => {
        const newPropertyNames = this.state.propertyNames.slice();
        newPropertyNames.splice(index, 1);
        const newPropertyValues = this.state.propertyValues.slice();
        newPropertyValues.splice(index, 1);
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
