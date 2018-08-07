import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessagePropertyInput } from './MessagePropertyInput';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from "react-bootstrap";

/** 
 * @prop { Object } message Can take a message as a prop to replay message.
 * @property {Object} message.MessageProperties User defined properties (key-string pairs).
 * @property {string} message.MessageBody The text of the message.
 * @property {string} message.MessageId The ID of the message.
 * @property {string} message.predefinedProperty Any other predefined properties used by Azure.
 */

export class MessageInput extends Component {
    constructor(props) {
        super(props);
        const message = this.props.message;
        this.arePreDefinedPropsLoaded = false;
        this.state = {
            permittedValues: [],
            messageBody: message ? message.MessageBody : '',
            userDefinedProperties: message ? this.getUserDefinedProperties(message) : [], //[{name: something, value: something}]
            preDefinedProperties: [], //[{name: something, value: something}]
            reservedPropertyNames: [], //a list of name of possible readable properties of a message
            selectedQueue: "demoqueue1"
            // QQ add way of choosing which queue/topic a message is sent to.
        };

        this.serviceBusService = serviceBusConnection.getServiceBusService();

        this.serviceBusService.getWriteableMessageProperties().then((result) => {
            this.arePreDefinedPropsLoaded = true;
            this.setState({
                permittedValues: result.data,
                preDefinedProperties: message ? this.getPreDefinedProperties(message) : [] //[{name: something, value: something}]
            });
        });

        this.serviceBusService.getReadableMessageProperties().then((result) => {
            this.setState({
                reservedPropertyNames: result.data
            });
        });

    }

    getUserDefinedProperties = (message) => {
        return this.getTargetProperties(message, "customProperties");
    }

    getPreDefinedProperties = (message) => {
        return this.getTargetProperties(message, "predefinedProperties");
    }

    getTargetProperties = (message, propertyClass) => {
        const properties = [];
        const keys = Object.keys(message[propertyClass]);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            properties.push({
                name: key,
                value: message[propertyClass][key]
            });
        }
        return properties;
    }

    /**
     * Updates a user-defined property name or value in the state.
     * @param {integer} position The position of the property in the list.
     * @param {string} attribute The attribute of the property that has changed, 'name' or 'value' 
     * @param {string} newValue The new value of that attribute of the property.
     */
    handleUserDefinedPropertyChange = (position, attribute, newValue) => {
        const newUserDefinedProperties = [...this.state.userDefinedProperties];
        newUserDefinedProperties[position][attribute] = newValue;
        this.setState({ userDefinedProperties: newUserDefinedProperties });
    };

    /**
    * Updates a pre-defined property name or value in the state.
    * @param {integer} position The position of the property in the list.
    * @param {string} attribute The attribute of the property that has changed, 'name' or 'value' 
    * @param {string} newValue The new value of that attribute of the property.
    */
    handlePreDefinedPropertyChange = (position, attribute, newValue) => {
        let newPreDefinedProperties = [...this.state.preDefinedProperties];
        newPreDefinedProperties[position][attribute] = newValue;
        this.setState({ preDefinedProperties: newPreDefinedProperties });
    };

    /**
     * Updates a collection of properties by applying the given updateOperation to it.
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     * @param {funciton} updateOperation The operation to be applied to the properties collection.
     */
    updatePropertiesCollection = (isUserDefined, updateOperation) => {
        const propertyType = isUserDefined ? "userDefinedProperties" : "preDefinedProperties";
        const newProperties = [...this.state[propertyType]];
        updateOperation(newProperties);
        this.setState({
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
            [propertyType]: newProperties
        });
    };

    /**
     * Adds a new property to the list of user-defined properties.
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     */
    addNewProperty = (isUserDefined) => {
        this.updatePropertiesCollection(isUserDefined, (propertyCollectionToMutate) => {
            propertyCollectionToMutate.push({ name: "", value: "" });
        });
    }

    /**
     * Deletes a row from the list of user defined properties.
     * @param {integer} index The index of the row to delete.
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     */
    deleteRow = (index, isUserDefined) => {
        this.updatePropertiesCollection(isUserDefined, (propertyCollectionToMutate) => {
            propertyCollectionToMutate.splice(index, 1);
        });
    };

    /**
     * Updates the message body in the state with a new value.
     * @param {string} newBody The new value of the body.
     */
    handleMessageBodyChange = newBody => {
        this.setState({ messageBody: newBody });
    };

    createMessagePropertyDictionary = (properties) => {
        const ret = {};
        for (let i = 0; i < properties.length; i++) {
            const thisPropertyName = properties[i].name;
            const thisPropertyValue = properties[i].value;
            //Prevent the user from inputting invalid property names.
            //Cannot use isPropertyNameInvalid here because if there are two properties with the same name it will mark
            //both of them as invalid whereas we just want to remove one of them.
            if (thisPropertyName && thisPropertyValue && !properties.hasOwnProperty(properties[i].name)) {
                if (thisPropertyName.length > 0) {
                    ret[thisPropertyName] = thisPropertyValue;
                }
            }
        }
        return ret;
    }

    /**
     * Converts the userDefinedProperties and preDefinedProperties arrays to a single message object
     * in the format that is accepted by the API.
     * @returns {object} The created message.
     */
    createMessageObject = () => {
        const message = {};
        message.customProperties = this.createMessagePropertyDictionary(this.state.userDefinedProperties);
        message.predefinedProperties = this.createMessagePropertyDictionary(this.state.preDefinedProperties);
        message.MessageBody = this.state.messageBody;
        return message;
    }

    discardMessage = () => {
        this.setState({
            messageBody: '',
            userDefinedProperties: [],
            preDefinedProperties: []
        });
    }

    submit = () => {
        const message = this.createMessageObject();
        this.serviceBusService.sendMessageToQueue(this.state.selectedQueue, message);
    }

    render() {
        const formStyle = css`
            margin-left: 5px;
            margin-right: 5px;
            padding-top: 1%;
            width: calc(100% - 10px); /* 10px total margin */
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
            padding-left: 5px;
        `;
        const buttonLoading = css`
            opacity: 0.5;
            :hover {
                cursor: progress; /*or progress*/	
            }
        `;
        const preDefinedPropertiesButtonText = this.arePreDefinedPropsLoaded ? 'Add new Azure property' : 'Loading pre-defined properties...';
        return (
            <div className={formStyle}>
                <div className={leftAlignContainerStyle}>
                    <p className={headingStyle}>Pre-defined Properties</p>
                </div>
                <MessagePropertyInput
                    properties={this.state.preDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.handlePreDefinedPropertyChange(index, 'name', newName)}
                    handlePropertyValueChange={(newValue, index) => this.handlePreDefinedPropertyChange(index, 'value', newValue)}
                    deleteRow={(index) => this.deleteRow(index, false)}
                    permittedValues={this.state.permittedValues}
                />
                <form>
                    <div className={leftAlignContainerStyle}>
                        <Button
                            className={`${buttonStyle} ${this.arePreDefinedPropsLoaded ? '' : buttonLoading}`}
                            onClick={() => this.addNewProperty(false)}
                        >
                            {preDefinedPropertiesButtonText}
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
                    handlePropertyValueChange={(newValue, index) => this.handleUserDefinedPropertyChange(index, 'value', newValue)}
                    deleteRow={(index) => this.deleteRow(index, true)}
                    reservedPropertyNames={this.state.reservedPropertyNames}
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
                    >
                        <ControlLabel className={headingStyle}>Body</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            placeholder="Enter message body"
                            className={bodyStyle}
                            value={this.state.messageBody}
                            onChange={(event) => this.handleMessageBodyChange(event.target.value)}
                        />
                    </FormGroup>
                </form>
                <form>
                    <Button
                        onClick={this.submit}
                    >
                        Submit
                    </Button>
                    <Button
                        onClick={this.discardMessage}
                        bsStyle="danger"
                    >
                        Reset Fields
                    </Button>
                </form>
            </div >
        );
    }

}
