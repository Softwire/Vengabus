import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessageBodyInput } from './MessageBodyInput';
import { MessageProperties } from './MessageProperties';
import { MessageDestinationForm } from './MessageDestinationForm';
import { ButtonWithConfirmationModal } from '../ButtonWithConfirmationModal';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { ButtonGroup } from 'react-bootstrap';
import { cancellablePromiseCollection } from '../../Helpers/CancellablePromiseCollection';
import _ from 'lodash';

/** 
 * @property {Object} message Can take a message as a prop to replay message.
 * @property {Object} message.customProperties User defined properties (key-string pairs).
 * @property {string} message.messageBody The text of the message.
 * @property {string} message.messageId The ID of the message.
 * @property {string} message.predefinedProperties Any other predefined properties used by Azure.
 * @property {bool} recipientIsQueue Is the recepient of the message a queue?
 * @property {string} selectedQueue Name of the recepient queue.
 * @property {string} selectedTopic Name of the recepient topic.
 */

export class MessageInput extends Component {
    constructor(props) {
        super(props);
        const message = this.props.message;
        this.promiseCollection = new cancellablePromiseCollection();
        this.state = {
            permittedValues: [],
            availableTopics: [],
            availableQueues: [],
            recipientIsQueue: !!(this.props.recipientIsQueue),
            messageBody: message ? message.messageBody : '',
            userDefinedProperties: message ? this.getUserDefinedProperties(message) : [], //[{name: something, value: something}]
            preDefinedProperties: [], //need to fetch permittedValues and reservedPropertyNames before this can be set
            reservedPropertyNames: [], //a list of name of possible readable properties of a message
            selectedQueue: this.props.selectedQueue,
            selectedTopic: this.props.selectedTopic,
            arePreDefinedPropsLoaded: false
        };
    }

    componentDidMount() {
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        let permittedValuesPromise = this.promiseCollection.addNewPromise(this.serviceBusService.getWriteableMessageProperties());
        let reservedPropertyNamesPromise = this.promiseCollection.addNewPromise(this.serviceBusService.getReadableMessageProperties());
        const fetchQueueDataPromise = this.promiseCollection.addNewPromise(this.serviceBusService.listQueues());
        const fetchTopicDataPromise = this.promiseCollection.addNewPromise(this.serviceBusService.listTopics());
        Promise.all([permittedValuesPromise, reservedPropertyNamesPromise]).then((result) => {
            this.setState({
                permittedValues: result[0],
                reservedPropertyNames: result[1],
                arePreDefinedPropsLoaded: true,
                preDefinedProperties: this.props.message ? this.getPreDefinedProperties(this.props.message, result[0], result[1]) : [] //[{name: something, value: something}]
            });
        }).catch((e) => { if (!e.isCanceled) { console.log(e); } });
        fetchQueueDataPromise.then((result) => {
            this.setState({
                availableQueues: this.convertArrayOfNamesToValueLabel(result)
            });
        }).catch((e) => { if (!e.isCanceled) { console.log(e); } });
        fetchTopicDataPromise.then((result) => {
            this.setState({
                availableTopics: this.convertArrayOfNamesToValueLabel(result)
            });
        }).catch((e) => { if (!e.isCanceled) { console.log(e); }  });
    }

    componentWillUnmount() {
        this.promiseCollection.cancelAllPromises();
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

    getPreDefinedProperties = (message, permittedValues, reservedPropertyNames) => {
        return this.getTargetProperties(message, "predefinedProperties", permittedValues, reservedPropertyNames);
    }

    /**
     * Gets the properties of a certain type from a message.
     * @param {object} message The message to get the properties from.
     * @param {string} propertyClass The class of properties to get,
     * either `customProperties` or `predefinedProperties`.
     * @param {string[]} settableProps List of keys whose value can be written.
     * @param {string[]} gettableProps List of keys whose value can be read.
     * @returns {object[]} The list of properties.
     */
    getTargetProperties = (message, propertyClass, settableProps, gettableProps) => {
        const outputProperties = [];
        const properties = message[propertyClass];
        const acceptAllProps = !settableProps || settableProps.length === 0;
        if (properties) { //check if properties are defined
            const keys = Object.keys(message[propertyClass]);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (acceptAllProps || settableProps.includes(key)) {
                    outputProperties.push({
                        name: key,
                        value: message[propertyClass][key]
                    });
                } else if (!gettableProps.includes(key)) {  //if the property is read-only then that is expected and can be ignored
                    //if this error is thrown then it is expected to be a programming error, not a user error or a bad message
                    throw new Error(`key ${key} was not an expected predefined property`);
                }
            }
        }
        return outputProperties;
    }

    handlePropertiesChange = (propertyType, newProperties) => {
        this.setState({ [propertyType]: newProperties });
    }

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
     * Updates the message body in the state with a new value.
     * @param {string} newBody The new value of the body.
     */
    handleMessageBodyChange = newBody => {
        this.setState({ messageBody: newBody });
    };

    handleDestinationChange = (isDestinationQueue, destinationName) => {
        this.setState({
            recipientIsQueue: isDestinationQueue,
            [isDestinationQueue ? "selectedQueue" : "selectedTopic"]: destinationName
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
        message.messageBody = this.state.messageBody;
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
        const fullWidth = css`
            float: left;
            width: 100%;
        `;

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
                : '';
        });

        reservedPropWarningList = reservedPropWarningList.filter((value) => value !== '');

        let warningCount = reservedPropWarningList.length + repetitivePropWarningList.length;

        let warnings;

        if (!warningCount) {
            warnings = null;
        }
        else {
            warnings =
                <React.Fragment>
                    {repetitivePropWarningList.map((value) => <p key={"repetitiveWarning " + value}>{value}</p>)}
                    {reservedPropWarningList.map((value) => <p key={"reservedWarning " + value}>{value}</p>)}
                </React.Fragment>;
        }

        let selectedEndpoint = this.state.recipientIsQueue ? this.state.selectedQueue : this.state.selectedTopic;

        return (
            <div className={formStyle} >
                <MessageDestinationForm
                    recipientIsQueue={this.state.recipientIsQueue}
                    availableQueues={this.state.availableQueues}
                    availableTopics={this.state.availableTopics}
                    selectedQueue={this.state.selectedQueue}
                    selectedTopic={this.state.selectedTopic}
                    handleDestinationChange={this.handleDestinationChange}
                />
                <hr className={fullWidth} />
                <MessageProperties
                    arePreDefinedPropsLoaded={this.state.arePreDefinedPropsLoaded}
                    preDefinedProperties={this.state.preDefinedProperties}
                    userDefinedProperties={this.state.userDefinedProperties}
                    permittedValues={this.state.permittedValues}
                    reservedPropertyNames={this.state.reservedPropertyNames}
                    handlePropertiesChange={this.handlePropertiesChange}
                />
                <hr className={fullWidth} />
                <MessageBodyInput
                    messageBody={this.state.messageBody}
                    handleMessageBodyChange={this.handleMessageBodyChange}
                />
                <form>
                    <ButtonGroup>
                        <ButtonWithConfirmationModal
                            id="submitButton"
                            buttonText={"Send Message"}
                            buttonStyle="default"
                            buttonDisabled={selectedEndpoint ? false : true}
                            modalTitle={"Send Message to " + selectedEndpoint}
                            modalBody={
                                <React.Fragment>
                                    <p>{"Message will be sent to: " + selectedEndpoint}</p>
                                    {warnings}
                                    <p>{"Confirm sending message?"}</p>
                                </React.Fragment>
                            }
                            confirmButtonText={"Send"}
                            confirmAction={this.submit}
                        />
                        <ButtonWithConfirmationModal
                            id="cancelButton"
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
                    </ButtonGroup>
                </form>
            </div >
        );
    }

}
