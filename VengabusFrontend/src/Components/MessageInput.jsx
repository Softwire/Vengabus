import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessagePropertyInput } from './MessagePropertyInput';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from "react-bootstrap";
import Select from 'react-select';
import _ from 'lodash';
import classNames from 'classnames';

/** 
 * @property {Object} message Can take a message as a prop to replay message.
 * @property {Object} message.customProperties User defined properties (key-string pairs).
 * @property {string} message.MessageBody The text of the message.
 * @property {string} message.MessageId The ID of the message.
 * @property {string} message.predefinedProperties Any other predefined properties used by Azure.
 * @property {bool} recipientIsQueue Is the recepient of the message a queue?
 * @property {string} selectedQueue Name of the recepient queue.
 * @property {string} selectedTopic Name of the recepient topic.
 */

export class MessageInput extends Component {
    constructor(props) {
        super(props);
        const message = this.props.message;
        this.arePredefinedPropsLoaded = false;
        this.state = {
            permittedValues: [],
            availableTopics: [],
            availableQueues: [],
            recipientIsQueue: this.props.recipientIsQueue ? this.props.recipientIsQueue : true,
            messageBody: message ? message.MessageBody : '',
            userDefinedProperties: message ? this.getUserDefinedProperties(message) : [], //[{name: something, value: something}]
            preDefinedProperties: [], //Not set here because permitted values must be fetched first
            reservedPropertyNames: [], //a list of name of possible readable properties of a message
            selectedQueue: this.props.selectedQueue ? this.props.selectedQueue : undefined,
            selectedTopic: this.props.selectedTopic ? this.props.selectedTopic : undefined
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
                availableQueues: this.convertArrayOfNamesToValueLabel(result)
            });
        });
        this.serviceBusService.listTopics().then((result) => {
            this.setState({
                availableTopics: this.convertArrayOfNamesToValueLabel(result)
            });
        });

        this.serviceBusService.getReadableMessageProperties().then((result) => {
            this.setState({
                reservedPropertyNames: result
            });
        });
    }

    /**
     * Converts a string to an object of the form:
     * `{value: "string", label: "string"}`
     * Used to add values to select elements.
     * @param {string} str The string to convert.
     * @returns {object} The created object.
     */
    convertToValueLabel = (str) => {
        return { value: str, label: str };
    }
    /**
     * Converts an array of objects with a name property to an array of objects with a value and label property:
     * `[{..., name: "example", ...}] -> [{value: "example", label: "example"}]`
     * Used to add values to select elements.
     * @param {object[]} arr The array of objects containing the names to use.
     * @returns {object[]} The created object.
     */
    convertArrayOfNamesToValueLabel = (arr) => {
        return _(arr).map((element) => this.convertToValueLabel(element.name));
    }

    getUserDefinedProperties = (message) => {
        return this.getTargetProperties(message, "customProperties");
    }

    getPreDefinedProperties = (message) => {
        return this.getTargetProperties(message, "predefinedProperties");
    }

    /**
     * Gets the properties of a certain type from a message.
     * @param {object} message The message to get the properties from.
     * @param {string} propertyClass The class of properties to get,
     * either `customProperties` or `predefinedProperties`.
     * @returns {object[]} The list of properties.
     */
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
        this.setState({
            selectedQueue: this.state.recipientIsQueue ? newName : undefined,
            selectedTopic: this.state.recipientIsQueue ? undefined : newName
        });
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
            //Cannot use isPropertyNameValid here because if there are two properties with the same name it will mark
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
            width: 20px;
            position:relative;
            top:9px;
        `;
        const queueOrTopicSelectionStyle = css`
            float: left;
            width: 75px;
        `;
        const queueOrTopicSelectionDropdownStyle = css`
            float: left;
            width: 275px;
            text-align:left;
        `;
        const buttonStyle = css`
            width: 270px;
            margin-left: 5px;
        `;
        const headingStyle = css`
            font-weight: bold;
            margin-left: 5px;
        `;
        const leftAlign = css`
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

        //generate warnings of certain property names.
        let customPropertyNames = this.state.userDefinedProperties.map((item) => item.name);
        let reservedPropertyNames = this.state.reservedPropertyNames;
        let repetitivePropertyList = [];
        let seenProperties = [];

        for (let i = 0; i < customPropertyNames.length; i++) {
            let propertyName = customPropertyNames[i];
            if (!repetitivePropertyList.includes(propertyName) && seenProperties.includes(propertyName)) {
                repetitivePropertyList.push(propertyName);
            }
            else if (!seenProperties.includes(propertyName)) {
                seenProperties.push(propertyName);
            }
        }

        let repetitivePropWarningList = repetitivePropertyList.map((value) =>
            "Warning: repetitive property name: '" + value + "'"
        );

        let reservedPropWarningList = reservedPropertyNames.map((value) => {
            return seenProperties.includes(value) ?
                "Warning: custom property '" + value + "' is potentially a predefined property"
                : ''
        });

        reservedPropWarningList = reservedPropWarningList.filter((value) => value !== '');

        let warningCount = reservedPropWarningList.length + repetitivePropWarningList.length;

        let warnings = (
            <React.Fragment>
                {repetitivePropWarningList.map((value) => <p key={"repetitiveWarning " + value}>{value}</p>)}
                {reservedPropWarningList.map((value) => <p key={"reservedWarning " + value}>{value}</p>)}
            </React.Fragment>
        );

        return (
            <div className={formStyle} >
                <div className={leftAlign}>
                    <p className={headingStyle}>Destination</p>
                </div>
                <div className={fullWidth}>
                    <div
                        onClick={() => this.handleRecipientTypeChange(true)}
                    >
                        <input
                            id="queue-selection-radio"
                            className={queueOrTopicSelectionRadioStyle}
                            type="radio"
                            value="queue"
                            checked={this.state.recipientIsQueue}
                            onChange={() => this.handleRecipientTypeChange(true)}
                        />
                        <div className={classNames(leftAlign, queueOrTopicSelectionStyle, headingStyle, verticalAlign)}>
                            <p>Queue</p>
                        </div>
                    </div>
                    <Select
                        isDisabled={!this.state.recipientIsQueue}
                        className={queueOrTopicSelectionDropdownStyle}
                        title="Queue"
                        id={"queue-dropdown"}
                        options={this.state.availableQueues}
                        value={this.state.selectedQueue ? this.convertToValueLabel(this.state.selectedQueue) : undefined}
                        onChange={(event) => this.handleQueueOrTopicChange(event.value)}
                    />
                </div>
                <div className={fullWidth}>
                    <div
                        onClick={() => this.handleRecipientTypeChange(false)}
                    >
                        <input
                            id="topic-selection-radio"
                            className={queueOrTopicSelectionRadioStyle}
                            type="radio"
                            value="topic"
                            checked={!this.state.recipientIsQueue}
                            onChange={() => this.handleRecipientTypeChange(false)}
                        />
                        <div className={classNames(leftAlign, queueOrTopicSelectionStyle, headingStyle, verticalAlign)}>
                            <p>Topic</p>
                        </div>
                    </div>
                    <Select
                        isDisabled={this.state.recipientIsQueue}
                        className={queueOrTopicSelectionDropdownStyle}
                        title="Topic"
                        id={"topic-dropdown"}
                        options={this.state.availableTopics}
                        value={this.state.selectedTopic ? this.convertToValueLabel(this.state.selectedTopic) : undefined}
                        onChange={(event) => this.handleQueueOrTopicChange(event.value)}
                    />
                </div>
                <hr className={fullWidth} />
                <div className={leftAlign}>
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
                    <div className={leftAlign}>
                        <Button
                            className={preDefinedPropsButtonClassNames}
                            onClick={() => this.addNewProperty(false)}
                        >
                            {preDefinedPropertiesButtonText}
                        </Button>
                    </div>
                </form>
                <hr />
                <div className={leftAlign}>
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
                    <div className={leftAlign}>
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
                        className={leftAlign}
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
                    <ButtonWithConfirmationModal
                        id="submitButton"
                        buttonText={"Send Message"}
                        modalTitle={"Send Message to " + this.state.selectedQueue}
                        modalBody={warningCount ? warnings : "Confirm sending message?"}
                        confirmButtonText={"Send"}
                        cancelButtonText={"Cancel"}
                        showModalAction={() => { }}
                        confirmAction={this.submit}
                        closeModalAction={() => { }}
                    />
                    <ButtonWithConfirmationModal
                        buttonText={"Reset Fields"}
                        modalTitle={"Reset all fields"}
                        modalBody={
                            <React.Fragment>
                                <p>Are you sure you want to reset ALL fields of the current message?</p>
                                <p>Note: if you are replaying an existing message, resetting the fields here will have NO effect on the orignal message.</p>
                            </React.Fragment>
                        }
                        confirmButtonText={"Reset"}
                        confirmAction={this.discardMessage}
                    />
                </form>
            </div >
        );
    }

}
