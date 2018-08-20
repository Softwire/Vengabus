import React, { Component } from 'react';
import { css } from 'emotion';
import classNames from 'classnames';
import moment from 'moment';
import { Tooltip, FormControl, FormGroup } from 'react-bootstrap';
import { DataTable } from './DataTable';
import { PropertyInput } from './PropertyInput';
import { TimeSpanInput } from './TimeSpanInput';
import { ButtonWithConfirmationModal } from './ButtonWithConfirmationModal';
import { PurgeMessagesButton } from './PurgeMessagesButton';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { formatTimeStamp } from '../Helpers/FormattingHelpers';
import { EndpointTypes } from '../Helpers/EndpointTypes';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in helpers.
 * @prop {string} selectedEndpoint The name of the endpoint being edited.
 * @prop {string} parentTopic The parent topic of the subscription being edited. Only required for subscriptions.
 */
export class CrudInterface extends Component {
    constructor(props) {
        super(props);

        this.state = {
            endpointType: this.props.endpointType,
            selectedEndpoint: this.props.selectedEndpoint,
            parentTopic: this.props.parentTopic, //necessary for subscriptions only
            endpointData: {},
            newEndpointData: {},
            receivedData: false
        };
    }

    componentDidMount = () => {
        if (!this.state.selectedEndpoint) { throw new Error('page requires selectedEndpoint prop'); }
        let promise;
        switch (this.state.endpointType) {
            case EndpointTypes.QUEUE:
                promise = serviceBusConnection.getServiceBusService().getQueueDetails(this.state.selectedEndpoint);
                break;
            case EndpointTypes.TOPIC:
                promise = serviceBusConnection.getServiceBusService().getTopicDetails(this.state.selectedEndpoint);
                break;
            case EndpointTypes.SUBSCRIPTION:
                if (!this.state.parentTopic) { throw new Error('for subscriptions parent topic must be defined'); }
                promise = serviceBusConnection.getServiceBusService().getSubscriptionDetails(this.state.parentTopic, this.state.selectedEndpoint);
                break;
            default:
                this.throwUnexpectedEndpointTypeError();
        }
        promise.then((result) => {
            result.autoDeleteOnIdle = this.parseTimeSpanFromBackend(result.autoDeleteOnIdle);
            if (result.mostRecentDeadLetter) { result.mostRecentDeadLetter = formatTimeStamp(result.mostRecentDeadLetter); }
            this.setState({ endpointData: result, newEndpointData: result, receivedData: true });
        });
    }


    throwUnexpectedEndpointTypeError = () => {
        throw new Error('unexpected endpoint type: ' + this.state.endpointType);
    }

    /**
     * @param {string} timespan As received from the backend.
     * @returns {object} Timespan object in that has properties: days, hours, minutes, seconds, milliseconds.
     */
    parseTimeSpanFromBackend = (timespan) => {
        const momentDuration = moment.duration(timespan);
        const days = Math.floor(momentDuration.asDays());
        let result = momentDuration._data;
        delete result.years;
        delete result.months;
        result.days = days;
        return result;
    }

    /**
     * @returns {string} Class name for standard hr component style used in this interface.
     */
    getHrStyle = () => {
        return css`
            color: black;
            background-color: black;
            height: 1px;
            width: 98%;
        `;
    }

    /**
     * @returns {Object <string, node>} Maps from property name to Tooltip component to be displayed on info hover over.
     */
    getTooltips = () => {
        return {
            requiresSession: <Tooltip id="tooltip">
                True if the receiver application can only receive from the {this.state.endpointType} through a MessageSession; false if a {this.state.endpointType} cannot receive using MessageSession.
            </Tooltip>,
            autoDeleteOnIdle: <Tooltip id="tooltip">
                The idle time span after which the {this.state.endpointType} is automatically deleted. The minimum duration is 5 minutes.
            </Tooltip>,
            maxDeliveryCount: <Tooltip id="tooltip">
                A message is automatically deadlettered after this number of deliveries.
            </Tooltip>,
            enableDeadLetteringOnMessageExpiration: <Tooltip id="tooltip">
                Sets whether this {this.state.endpointType} has dead letter support when a message expires.
             </Tooltip>
        };
    }

    /**
     * @returns {Object <string, {label: string, value: any}>[]} Maps from property name to permitted dropdown options where required.
     */
    getDropdownOptions = () => {
        const statusOptions = [{ label: 'Active', value: 'Active' }, { label: 'Disabled', value: 'Disabled' }];
        return {
            status: statusOptions,
            topicStatus: statusOptions,
            subscriptionStatus: statusOptions
        };
    }

    /**
     * @returns {Object <string, class>} Maps property name to component type for the cases where this is required.
     */
    getObjectPropertyToComponent = () => {
        return {
            autoDeleteOnIdle: TimeSpanInput
        };
    }

    /**
     * @returns {node[]} Input components for editable properties.
     * @returns {node} Data table for read-only properties.
     */
    getEditableAndReadOnlyPropertyComponents = () => {
        let readOnlyProperties, editableProperties;
        switch (this.state.endpointType) {
            case EndpointTypes.QUEUE:
                [editableProperties, readOnlyProperties] = this.getEditableAndReadOnlyPropertiesForQueue();
                break;
            case EndpointTypes.TOPIC:
                [editableProperties, readOnlyProperties] = this.getEditableAndReadOnlyPropertiesForTopic();
                break;
            case EndpointTypes.SUBSCRIPTION:
                [editableProperties, readOnlyProperties] = this.getEditableAndReadOnlyPropertiesForSubscription();
                break;
            default:
                this.throwUnexpectedEndpointTypeError();
        }
        const tableStyle = css`
            width: 98%;
            padding-left: 20px;
        `;
        const rowStyle = css`
            text-align: left;
        `;
        const colProps = [{ dataField: 'name', text: 'Property Name', headerStyle: { textAlign: 'left' } }, { dataField: 'value', headerStyle: { textAlign: 'left' } }];
        const editablePropertyInputs = this.getEditablePropertyInputs(editableProperties);
        const readOnlyPropertyTable =
            <div>
                <hr className={this.getHrStyle()} />
                <div className={tableStyle} >
                    <DataTable
                        dataToDisplay={readOnlyProperties}
                        uniqueKeyColumn='name'
                        colProps={colProps}
                        rowClasses={rowStyle}
                        bordered={false}
                        hover
                    />
                </div>
                <hr className={this.getHrStyle()} />
            </div>;
        return [editablePropertyInputs, readOnlyPropertyTable];
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyPropertiesForQueue = () => {
        const { activeMessageCount, deadletterMessageCount, mostRecentDeadLetter } = this.state.newEndpointData;
        const readOnlyProperties = this.assembleReadOnlyProperties({
            // text in the left column: value in the right column
            "Active Message Count": activeMessageCount,
            "Dead Letter Message Count": deadletterMessageCount,
            "Most Recent Dead Letter": mostRecentDeadLetter
        });
        const editableProperties = [
            'supportOrdering',
            'requiresSession',
            'enablePartitioning',
            'autoDeleteOnIdle',
            'enableDeadLetteringOnMessageExpiration',
            'requiresDuplicateDetection',
            'maxDeliveryCount',
            'maxSizeInMegabytes',
            'status'
        ];
        return [editableProperties, readOnlyProperties];
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyPropertiesForTopic = () => {
        const { subscriptionCount } = this.state.newEndpointData;
        const readOnlyProperties = this.assembleReadOnlyProperties({
            // text in the left column: value in the right column
            "Subscription Count": subscriptionCount
        });
        const editableProperties = [
            'supportOrdering',
            'enablePartitioning',
            'autoDeleteOnIdle',
            'requiresDuplicateDetection',
            'maxSizeInMegabytes',
            'topicStatus'
        ];
        return [editableProperties, readOnlyProperties];
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyPropertiesForSubscription = () => {
        const { activeMessageCount, deadletterMessageCount, mostRecentDeadLetter, topicName } = this.state.newEndpointData;
        const readOnlyProperties = this.assembleReadOnlyProperties({
            // text in the left column: value in the right column
            "Parent Topic": topicName,
            "Active Message Count": activeMessageCount,
            "Dead Letter Message Count": deadletterMessageCount,
            "Most Recent Dead Letter": mostRecentDeadLetter

        });
        const editableProperties = [
            'requiresSession',
            'autoDeleteOnIdle',
            'enableDeadLetteringOnMessageExpiration',
            'maxDeliveryCount',
            'subscriptionStatus'
        ];
        return [editableProperties, readOnlyProperties];
    }

    /**
     * @param {object} properties Display name and display value pairs for read-only properties.
     * @returns {object[]} Read-only properties in a format that can be displayed by the DataTable.
     */
    assembleReadOnlyProperties = (properties) => {
        let readOnlyProperties = [];
        const keys = Object.keys(properties);
        for (let i = 0; i < keys.length; i++) {
            readOnlyProperties.push({
                name: keys[i],
                value: properties[keys[i]]
            });
        }
        return readOnlyProperties;
    }

    /**
     * @param {string[]} editableProperties Property names for editable properties.
     * @returns {node[]} Array of jsx elements for property inputs.
     */
    getEditablePropertyInputs = (editableProperties) => {
        let editablePropertyInputs = [];
        for (let i = 0; i < editableProperties.length; i++) {
            const property = editableProperties[i];
            editablePropertyInputs.push(<hr className={this.getHrStyle()} key={i} />);
            editablePropertyInputs.push(
                <PropertyInput
                    text={property.charAt(0).toUpperCase() + property.substr(1)}
                    data={this.state.newEndpointData[property]}
                    tooltip={this.getTooltips()[property]}
                    onChange={(data) => this.handlePropertyChange(data, property)}
                    componentType={this.getObjectPropertyToComponent()[property]}
                    options={this.getDropdownOptions()[property]}
                    key={`propertyInput${i}`}
                />
            );
        }
        editablePropertyInputs.push(<hr className={this.getHrStyle()} key={editableProperties.length} />);
        return editablePropertyInputs;
    }

    /**
     * @param {any} value New value that was input by the user.
     * @param {string} property The property of newEndpointData that was changed.
     */
    handlePropertyChange(value, property) {
        const updatedNewEndpointData = { ...this.state.newEndpointData };
        updatedNewEndpointData[property] = value;
        this.setState({
            newEndpointData: updatedNewEndpointData
        });
    }

    /**
     * @returns {node} Title component.
     */
    getTitle = () => {
        const titleText = `Editing ${this.state.endpointType}: ${this.state.selectedEndpoint}`;
        const titleStyle = css`
            font-size: 2em;
            font-weight: bold;
            text-align: center;
        `;
        return (
            <div>
                <p className={titleStyle}>
                    {titleText + '  '}
                    <ButtonWithConfirmationModal
                        id="renameButton"
                        buttonText={"Rename"}
                        buttonStyle="primary"
                        modalTitle={"Rename " + this.state.selectedEndpoint}
                        modalBody={
                            <React.Fragment>
                                <p>New Name</p>
                                <FormGroup>
                                    <FormControl
                                        type="string"
                                        placeholder="Enter New Name"
                                        onChange={(event) => this.newName = event.target.value}
                                    />
                                </FormGroup>
                            </React.Fragment>
                        }
                        confirmButtonText={"Rename"}
                        confirmAction={this.renameEndpoint}
                    />
                </p>
                <hr className={this.getHrStyle()} />
            </div>
        );
    }

    /**
     * @returns {node} Buttons at the bottom of the page.
     */
    getFormButtons = () => {
        const buttonFormStyle = css`
            text-align: center;
            padding-bottom: 15px;
        `;

        return (
            <form className={buttonFormStyle}>
                <ButtonWithConfirmationModal
                    id="submitButton"
                    buttonText={"Update"}
                    buttonStyle="default"
                    buttonDisabled={this.checkObjectEquality(this.state.endpointData, this.state.newEndpointData)}
                    modalTitle={"Update Queue"}
                    modalBody={
                        <React.Fragment>
                            <p>{"Following queue will be updated: " + this.state.selectedEndpoint}</p>
                            <p>{"Confirm action?"}</p>
                        </React.Fragment>
                    }
                    confirmButtonText={"Update"}
                    confirmAction={this.updateEndpoint}
                />
                <ButtonWithConfirmationModal
                    id="resetButton"
                    buttonText={"Reset Fields"}
                    buttonDisabled={this.checkObjectEquality(this.state.endpointData, this.state.newEndpointData)}
                    modalTitle={"Reset all fields"}
                    modalBody={
                        <React.Fragment>
                            <p>Are you sure you want to reset ALL fields of the current queue?</p>
                            <p>Note: if you are updating an existing queue, resetting the fields here will have NO effect on the orignal queue.</p>
                        </React.Fragment>
                    }
                    confirmButtonText={"Reset"}
                    confirmAction={this.resetFields}
                />
                <PurgeMessagesButton id="purgeMessage" type={this.state.endpointType} endpointName={this.state.selectedEndpoint} />
            </form>
        );
    }

    /**
     * @param {object} obj1 First object to be compared.
     * @param {object} obj2 Second object to be compared.
     * @returns {boolean} True if the objects are identical, false otherwise.
     * Does not support arrays as properties
     */
    checkObjectEquality = (obj1, obj2) => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) { return false; }

        for (let i = 0; i < keys1.length; i++) {
            const key = keys1[i];
            if (typeof obj1[key] === 'object' && obj1[key] !== null) {  // because typeof null = 'object'
                if (typeof obj2[key] !== 'object' || !this.checkObjectEquality(obj1[key], obj2[key])) { return false; }
            } else if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

    renameEndpoint = () => {
        const oldName = this.state.endpointData.name;
        const newName = this.newName;
        switch (this.state.endpointType) {
            case EndpointTypes.QUEUE:
                serviceBusConnection.getServiceBusService().renameQueue(oldName, newName);  //doesn't work (error 500 Internal server error)
                break;
            case EndpointTypes.TOPIC:
                serviceBusConnection.getServiceBusService().renameTopic(oldName, newName);  //doesn't work (error 500 Internal server error)
                break;
            case EndpointTypes.SUBSCRIPTION:
                console.log('cannot rename subscriptions because #Microsoft');
                break;
            default:
                this.throwUnexpectedEndpointTypeError();
        }
        this.setState({
            endpointData: { ...this.state.endpointData, name: newName },
            newEndpointData: { ...this.state.newEndpointData, name: newName },
            selectedEndpoint: newName
        });
        delete this.newName;
    }

    updateEndpoint = () => {
        switch (this.state.endpointType) {
            case EndpointTypes.QUEUE:
                serviceBusConnection.getServiceBusService().updateQueue(this.state.newEndpointData);
                break;
            case EndpointTypes.TOPIC:
                serviceBusConnection.getServiceBusService().updateTopic(this.state.newEndpointData);
                break;
            case EndpointTypes.SUBSCRIPTION:
                serviceBusConnection.getServiceBusService().updateSubscription(this.state.newEndpointData);
                break;
            default:
                this.throwUnexpectedEndpointTypeError();
        }
    }

    resetFields = () => {
        this.setState({
            newEndpointData: this.state.endpointData
        });
    }

    render() {
        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;
        const headerStyle = css`
            padding-top: 10px;
            font-weight: bold;
            font-size: 1.6em;
        `;
        let editablePropertyInputs, readOnlyPropertyTable;
        if (this.state.receivedData) {
            [editablePropertyInputs, readOnlyPropertyTable] = this.getEditableAndReadOnlyPropertyComponents();
        }

        return (
            this.state.receivedData ? (
                <div>
                    <br />
                    {this.getTitle()}

                    <p className={classNames(leftAlign, headerStyle)}>Read-Only Properties</p>
                    {readOnlyPropertyTable}

                    <p className={classNames(leftAlign, headerStyle)}>Editable Properties</p>
                    {editablePropertyInputs}

                    {this.getFormButtons()}
                </div>
            ) : (
                    <p>Fetching data</p>
                )
        );

    }
}
