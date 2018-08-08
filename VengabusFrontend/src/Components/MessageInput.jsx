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
import Select from 'react-select';
import _ from 'lodash';
const classNames = require('classnames');

/** 
 * @prop {Object} data All of the data that is passed down into this component.
 * @property {Object} data.message Can take a message as a prop to replay message.
 * @property {Object} data.message.customProperties User defined properties (key-string pairs).
 * @property {string} data.message.MessageBody The text of the message.
 * @property {string} data.message.MessageId The ID of the message.
 * @property {string} data.message.predefinedProperties Any other predefined properties used by Azure.
 * @property {bool} data.recipientIsQueue Is the recepient of the message a queue?
 * @property {string} data.selectedQueue Name of the recepient queue.
 * @property {string} data.selectedTopic Name of the recepient topic.
 */

export class MessageInput extends Component {
    constructor(props) {
        super(props);
        const data = this.props.data || {};
        const message = data.message;
        this.arePredefinedPropsLoaded = false;
        this.state = {
            permittedValues: [],
            availableTopics: [],
            availableQueues: [],
            recipientIsQueue: data.recipientIsQueue ? data.recipientIsQueue : true,
            messageBody: message ? message.MessageBody : '',
            userDefinedProperties: message ? this.getUserDefinedProperties(message) : [], //[{name: something, value: something}]
            preDefinedProperties: [], //Not set here because permitted values must be fetched first
            reservedPropertyNames: [], //a list of name of possible readable properties of a message
            selectedQueue: data.selectedQueue ? data.selectedQueue : undefined,
            selectedTopic: data.selectedTopic ? data.selectedTopic : undefined
        };
    }

    componentDidMount() {
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        this.serviceBusService.getWriteableMessageProperties().then((result) => {
            this.arePredefinedPropsLoaded = true;
            this.setState({
                permittedValues: result,
                preDefinedProperties: this.props.message ? this.getPreDefinedProperties(this.props.message) : [] //[{name: something, value: something}]
            });
        });
        this.serviceBusService.listQueues().then((result) => {
            this.setState({
                availableQueues: _(result.data).map((queue) => { return { value: queue.name, label: queue.name }; })
            });
        });
        this.serviceBusService.listTopics().then((result) => {
            this.setState({
                availableTopics: _(result.data).map((topic) => { return { value: topic.name, label: topic.name }; })
            });
        });

        this.serviceBusService.getReadableMessageProperties().then((result) => {
            this.setState({
                reservedPropertyNames: result
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

    /**
     * Changes which queue or topic the message will be sent to.
     * @param {string} newName The name of the queue or topic.
     */
    handleQueueOrTopicChange = (newName) => {
        if (this.state.recipientIsQueue) {
            this.setState({
                selectedQueue: newName,
                selectedTopic: undefined
            });
        } else {
            this.setState({
                selectedQueue: undefined,
                selectedTopic: newName
            });
        }
    }

    /**
     * Changes whether the message will be sent to a queue or topic.
     * @param {boolean} isQueue True if the message should be send to a queue, false if it should be sent to a topic.
     */
    handleRecipientTypeChange = (isQueue) => {
        this.setState({
            recipientIsQueue: isQueue
        });
    }

    /**
     * Converts an array of properties to a properties object:
     * [{name: name1, value: value1}] -> {name1: value1}
     * @param {object[]} properties The array of properties to convert.
     * @returns {object} The created properties object.
     */
    createMessagePropertyDictionary = (properties) => {
        const ret = {};
        for (let i = 0; i < properties.length; i++) {
            const thisPropertyName = properties[i].name;
            const thisPropertyValue = properties[i].value;
            //Prevent the user from inputting invalid property names.
            //Cannot use isPropertyNameInvalid here because if there are two properties with the same name it will mark
            //both of them as invalid whereas we just want to remove one of them.
            if (thisPropertyName && thisPropertyValue && !ret.hasOwnProperty(thisPropertyName)) {
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

    /**
     * Clears the message body and removes all properties from the message.
     */
    discardMessage = () => {
        this.setState({
            messageBody: '',
            userDefinedProperties: [],
            preDefinedProperties: []
        });
    }

    /**
     * Sends the message to the selected queue/topic.
     */
    submit = () => {
        const message = this.createMessageObject();
        if (this.state.recipientIsQueue) {
            this.serviceBusService.sendMessageToQueue(this.state.selectedQueue, message);
        } else {
            this.serviceBusService.sendMessageToTopic(this.state.selectedTopic, message);
        }
    }

    render() {
        const formStyle = css`
            margin-left: 5px;
            margin-right: 5px;
            padding-top: 1%;
            width: calc(100% - 10px); /* 10px total margin */
            float: left;
        `;
        const queueOrTopicSelectionRadioStyle = css`
            float: left;
            width: 2%;
            position:relative;
            top:9px;
        `;
        const queueOrTopicSelectionStyle = css`
            float: left;
            width: 5%;
        `;
        const queueOrTopicSelectionDropdownStyle = css`
            float: left;
            width: 92%;
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
        const verticalAlign = css`
            line-height: 38px;
        `;
        const fullWidth = css`
            float: left;
            width: 100%;
        `;
        const buttonLoading = css`
            opacity: 0.5;
            :hover {
                cursor: progress;
            }
        `;
        let preDefinedPropsButtonClassNames = classNames(buttonStyle, this.arePredefinedPropsLoaded || buttonLoading);
        const preDefinedPropertiesButtonText = this.arePredefinedPropsLoaded ? 'Add new Azure property' : 'Loading pre-defined properties...';
        return (
            <div className={formStyle} >
                <div className={leftAlignContainerStyle}>
                    <p className={headingStyle}>Destination</p>
                </div>
                <div className={fullWidth}>
                    <div
                        onClick={() => this.handleRecipientTypeChange(true)}
                    >
                        <input
                            className={queueOrTopicSelectionRadioStyle}
                            type="radio"
                            value="queue"
                            checked={this.state.recipientIsQueue}
                            onChange={() => this.handleRecipientTypeChange(true)}
                        />
                        <div className={leftAlignContainerStyle + " " + queueOrTopicSelectionStyle + " " + headingStyle + " " + verticalAlign}>
                            <p>Queue</p>
                        </div>
                    </div>
                    <Select
                        isDisabled={!this.state.recipientIsQueue}
                        className={queueOrTopicSelectionDropdownStyle}
                        title="Queue"
                        id={"queue-dropdown"}
                        options={this.state.availableQueues}
                        value={this.state.selectedQueue ? { value: this.state.selectedQueue, label: this.state.selectedQueue } : undefined}
                        onChange={(event) => this.handleQueueOrTopicChange(event.value)}
                    />
                </div>
                <div className={fullWidth}>
                    <div
                        onClick={() => this.handleRecipientTypeChange(false)}
                    >
                        <input
                            className={queueOrTopicSelectionRadioStyle}
                            type="radio"
                            value="topic"
                            checked={!this.state.recipientIsQueue}
                            onChange={() => this.handleRecipientTypeChange(false)}
                        />
                        <div className={leftAlignContainerStyle + " " + queueOrTopicSelectionStyle + " " + headingStyle + " " + verticalAlign}>
                            <p>Topic</p>
                        </div>
                    </div>
                    <Select
                        isDisabled={this.state.recipientIsQueue}
                        className={queueOrTopicSelectionDropdownStyle}
                        title="Topic"
                        id={"topic-dropdown"}
                        options={this.state.availableTopics}
                        value={this.state.selectedTopic ? { value: this.state.selectedTopic, label: this.state.selectedTopic } : undefined}
                        onChange={(event) => this.handleQueueOrTopicChange(event.value)}
                    />
                </div>
                <hr className={fullWidth} />
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
                            className={preDefinedPropsButtonClassNames}
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
                        id="submitButton"
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
