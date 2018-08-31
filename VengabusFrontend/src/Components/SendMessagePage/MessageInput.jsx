import React, { Component } from 'react';
import { css } from 'react-emotion';
import classNames from 'classnames';
import { MessageBodyInput } from './MessageBodyInput';
import { MessageProperties } from './MessageProperties';
import { MessageDestinationForm } from './MessageDestinationForm';
import { MessageSendAndResetButtons } from './MessageSendAndResetButtons';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { cancellablePromiseCollection } from '../../Helpers/CancellablePromiseCollection';
import { sharedSizesAndDimensions, zIndices } from '../../Helpers/SharedSizesAndDimensions';
import _ from 'lodash';
import { UploadMessageFileButton } from '../../Components/UploadMessageFileButton';


const defaultBlankMessage = Object.freeze({
    messageBody: '',
    userDefinedProperties: [],
    preDefinedProperties: []
});
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
            arePreDefinedPropsLoaded: false,
            sendMessageModalWarnings: null
        };
    }

    componentDidMount() {
        this.serviceBusService = serviceBusConnection.getServiceBusService();

        let permittedValuesPromise = this.promiseCollection.addNewPromise(this.serviceBusService.getWriteableMessageProperties());
        let reservedPropertyNamesPromise = this.promiseCollection.addNewPromise(this.serviceBusService.getReadableMessageProperties());
        Promise.all([permittedValuesPromise, reservedPropertyNamesPromise]).then((result) => {
            this.setState({
                permittedValues: result[0],
                reservedPropertyNames: result[1],
                arePreDefinedPropsLoaded: true
            });
            this.setMessageDetails(this.props.messageBody, result[0], result[1]);
        }).catch((e) => { if (!e.isCanceled) { console.log(e); } });


        const fetchQueueDataPromise = this.promiseCollection.addNewPromise(this.serviceBusService.listQueues());
        const fetchTopicDataPromise = this.promiseCollection.addNewPromise(this.serviceBusService.listTopics());
        fetchQueueDataPromise.then((result) => {
            this.setState({
                availableQueues: this.convertArrayOfNamesToValueLabel(result)
            });
        }).catch((e) => { if (!e.isCanceled) { console.log(e); } });
        fetchTopicDataPromise.then((result) => {
            this.setState({
                availableTopics: this.convertArrayOfNamesToValueLabel(result)
            });
        }).catch((e) => { if (!e.isCanceled) { console.log(e); } });
    }

    componentWillUnmount() {
        this.promiseCollection.cancelAllPromises();
    }

    setMessageDetails = (messageObject, permittedValues, reservedValues) => {
        if (!messageObject) {
            return;//this.setState({ ...defaultBlankMessage });
        }
        const preDefinedProps = this.getPreDefinedProperties(messageObject, permittedValues, reservedValues);
        this.setState({
            messageBody: messageObject.messageBody,
            userDefinedProperties: this.getUserDefinedProperties(messageObject),
            preDefinedProperties: preDefinedProps
        });
    }

    setMessageFieldsFromFileObject = (fileReadMessagePromise) => {
        const messagePromise = this.promiseCollection.addNewPromise(fileReadMessagePromise);
        messagePromise.then(messageObjects => {
            this.setMessageDetails(messageObjects[0], this.permittedValues, this.reservedPropertyNames);
        }); //.catch is handled by the LoadFile button - displays a notification. 
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

    setWarnings = (warnings) => {
        this.propertyWarnings = warnings;
    }

    //generate warnings JSX.
    constructPropertyWarnings = () => {
        if (!this.propertyWarnings || !this.propertyWarnings.length) {
            this.setState({ sendMessageModalWarnings: null });
        } else {
            const warnings = this.propertyWarnings.map((value) => (<p key={"Warning " + value}>{value}</p>));
            this.setState({
                sendMessageModalWarnings: (<React.Fragment>{warnings}</React.Fragment>)
            });
        }
    }

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
        this.setState({ ...defaultBlankMessage });
    }

    /**
     * Sends the message to the selected queue/topic.
     *  @returns {nothing} for the promice
     */
    submit = () => {
        const message = this.createMessageObject();
        if (this.state.recipientIsQueue) {
            return this.serviceBusService.sendMessageToQueue(this.state.selectedQueue, message);
        } else {
            return this.serviceBusService.sendMessageToTopic(this.state.selectedTopic, message);
        }
    }

    render() {
        let stickyHeight = "150px";
        const formStyle = css`
            margin-left: 5px;
            margin-right: 5px;
            width: calc(100% - 10px); /* 10px total margin */
            float: left;
        `;
        const fullWidth = css`
            float: left;
            width: 100%;
        `;
        const topSticky = css`
            z-index: ${zIndices.SEND_MESSAGE_STICKY};
            position: fixed;
            width: calc(100% - ${sharedSizesAndDimensions.SIDEBAR_WIDTH}px);
            height: ${stickyHeight};
            background-color: #ECEFF1;
            border-bottom: 2px solid black;
            padding-top: 10px;
            margin-left: -5px; /* Form margin undesirable for sticky section */
            padding-left: 10px;
            padding-right: 10px;
        `;
        const stickySpacer = css`
            height: calc(${stickyHeight} + 10px);
        `;
        const destinationFormStyle = css`
            width: 450px;
            float: left;
        `;
        const vertAlignButtons = css`
            margin-top: 10px;
        `;
        const floatRightWithMargin = css`
            float: right;
            margin-right:20px;
        `;

        const selectedEndpoint = this.state.recipientIsQueue ? this.state.selectedQueue : this.state.selectedTopic;

        //construct child components
        const messageDestinationForm = <MessageDestinationForm
            recipientIsQueue={this.state.recipientIsQueue}
            availableQueues={this.state.availableQueues}
            availableTopics={this.state.availableTopics}
            selectedQueue={this.state.selectedQueue}
            selectedTopic={this.state.selectedTopic}
            handleDestinationChange={this.handleDestinationChange}
        />;

        const mainButtons = <MessageSendAndResetButtons
            selectedEndpoint={selectedEndpoint}
            warnings={this.state.sendMessageModalWarnings}
            generateWarnings={this.constructPropertyWarnings}
            submit={this.submit}
            discardMessage={this.discardMessage}
        />;

        const uploadFromFile = (
            <React.Fragment>
                <p>Upload Message from File</p>

                <UploadMessageFileButton
                    disabled={!this.state.arePreDefinedPropsLoaded}
                    onUpload={this.setMessageFieldsFromFileObject}
                    text="Upload message from file"
                />
            </React.Fragment>
        );

        const messageProperties = <MessageProperties
            arePreDefinedPropsLoaded={this.state.arePreDefinedPropsLoaded}
            preDefinedProperties={this.state.preDefinedProperties}
            userDefinedProperties={this.state.userDefinedProperties}
            permittedValues={this.state.permittedValues}
            reservedPropertyNames={this.state.reservedPropertyNames}
            handlePropertiesChange={this.handlePropertiesChange}
            reportWarnings={this.setWarnings}
        />;

        const messageBodyInput = <MessageBodyInput
            messageBody={this.state.messageBody}
            handleMessageBodyChange={this.handleMessageBodyChange}
        />;

        return (
            <div className={formStyle} >
                <div className={topSticky}>
                    <div className={destinationFormStyle}>
                        {messageDestinationForm}
                    </div>
                    <div className={classNames(vertAlignButtons, floatRightWithMargin)}>
                        {mainButtons}
                    </div>
                </div>
                <div className={stickySpacer} />
                {uploadFromFile}
                <hr className={fullWidth} />
                {messageProperties}
                <hr className={fullWidth} />
                {messageBodyInput}
            </div >
        );
    }

}
