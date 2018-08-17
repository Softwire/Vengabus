import React, { Component } from 'react';
import { Tooltip, FormControl, FormGroup } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { css } from 'emotion';
import classNames from 'classnames';
import { DataTable } from '../Components/DataTable';
import moment from 'moment';
import { PropertyInput } from '../Components/PropertyInput';
import { TimeSpanInput } from '../Components/TimeSpanInput';
import { DropdownInput } from '../Components/DropdownInput';
import { ButtonWithConfirmationModal } from '../Components/ButtonWithConfirmationModal';

export class EditQueuesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            endpointType: 'queue',
            selectedEndpoint: "mkdemoqueue",
            endpointData: {},
            newEndpointData: {},
            receivedData: false
        };
    }

    componentDidMount = () => {
        let promise;
        switch (this.state.endpointType) {
            case 'queue':
                promise = serviceBusConnection.getServiceBusService().getQueueDetails(this.state.selectedEndpoint);
                break;
            case 'topic':
                promise = serviceBusConnection.getServiceBusService().getTopicDetails(this.state.selectedEndpoint);
                break;
            default:
                this.throwUnexpectedEndpointTypeError();
        }
        promise.then((result) => {
            result.autoDeleteOnIdle = this.parseTimeSpanFromBackend(result.autoDeleteOnIdle);
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

    getHrStyle = () => {
        return css`
            color: black;
            background-color: black;
            height: 1px;
            width: 98%;
        `;
    }

    getStyles = () => {
        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;
        const hrStlye = this.getHrStyle();
        const headerStyle = css`
            padding-top: 10px;
            font-weight: bold;
            font-size: 1.6em;
        `;
        const tableStyle = css`
            width: 98%;
            padding-left: 20px;
        `;
        const rowStyle = css`
            text-align: left;
        `;
        const buttonFormStyle = css`
            text-align: center;
            padding-bottom: 15px;
        `;
        const titleStyle = css`
            font-size: 2em;
            font-weight: bold;
            text-align: center;
        `;

        return [titleStyle, leftAlign, hrStlye, headerStyle, tableStyle, rowStyle, buttonFormStyle];
    }

    /**
     * @returns {Object <string, node>} Maps from property name to Tooltip component to be displayed on info hover over.
     */
    getTooltips = () => {
        return {
            requiresSession: <Tooltip id="tooltip">
                True if the receiver application can only receive from the queue through a MessageSession; false if a queue cannot receive using MessageSession.
            </Tooltip>,
            autoDeleteOnIdle: <Tooltip id="tooltip">
                The idle time span after which the queue is automatically deleted. The minimum duration is 5 minutes.
            </Tooltip>,
            maxDeliveryCount: <Tooltip id="tooltip">
                A message is automatically deadlettered after this number of deliveries.
            </Tooltip>,
            enableDeadLetteringOnMessageExpiration: <Tooltip id="tooltip">
                Sets whether this queue has dead letter support when a message expires.
             </Tooltip>
        };
    }

    /**
     * @returns {Object <string, {label: string, value: any}>[]} Maps from property name to permitted dropdown options where required.
     */
    getDropdownOptions = () => {
        return {
            status: [{ label: 'Active', value: 'Active' }, { label: 'Disabled', value: 'Disabled' }]
        };
    }

    /**
     * @returns {Object <string, class>} Maps property name to component type for the cases where this is required.
     */
    getObjectPropertyToComponent = () => {
        return {
            autoDeleteOnIdle: TimeSpanInput,
            status: DropdownInput
        };
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyProperties = () => {
        switch (this.state.endpointType) {
            case 'queue':
                return this.getEditableAndReadOnlyPropertiesForQueue();
            case 'topic':
                return this.getEditableAndReadOnlyPropertiesForTopic();
            default:
                this.throwUnexpectedEndpointTypeError();
        }
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
        const { name, subscriptionCount, topicStatus } = this.state.newEndpointData;
        const readOnlyProperties = this.assembleReadOnlyProperties({
            // text in the left column: value in the right column
            "Name": name,
            "Subscription Count": subscriptionCount,
            "Status": topicStatus
        });
        const editableProperties = [
            'supportOrdering',
            'enablePartitioning',
            'autoDeleteOnIdle'
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

    handlePropertyChange(value, property) {
        const updatedNewEndpointData = { ...this.state.newEndpointData };
        updatedNewEndpointData[property] = value;
        this.setState({
            newEndpointData: updatedNewEndpointData
        });
    }

    //Does not support arrays as properties
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
            case 'queue':
                serviceBusConnection.getServiceBusService().renameQueue(oldName, newName);
                break;
            case 'topic':
                serviceBusConnection.getServiceBusService().renameTopic(oldName, newName);
                break;
            default:
                this.throwUnexpectedEndpointTypeError();
        }
        this.setState({
            endpointData: { ...this.state.endpointData, name: newName },
            newEndpointData: { ...this.state.newEndpointData, name: newName }
        });
        delete this.newName;
    }

    updateEndpoint = () => {
        const dataToSend = { ...this.state.newEndpointData };
        console.log(dataToSend);
        switch (this.state.endpointType) {
            case 'queue':
                serviceBusConnection.getServiceBusService().updateQueue(this.state.newEndpointData);
                break;
            case 'topic':
                serviceBusConnection.getServiceBusService().updateTopic(this.state.newEndpointData);
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
        const colProps = [{ dataField: 'name', text: 'Property Name', headerStyle: { textAlign: 'left' } }, { dataField: 'value', headerStyle: { textAlign: 'left' } }];
        const [titleStyle, leftAlign, hrStlye, headerStyle, tableStyle, rowStyle, buttonFormStyle] = this.getStyles();
        const [editableProperties, readOnlyProperties] = this.getEditableAndReadOnlyProperties();
        const editablePropertyInputs = this.getEditablePropertyInputs(editableProperties);
        const titleText = `Editing ${this.state.endpointType}: ${this.state.selectedEndpoint}`;

        return (
            this.state.receivedData ? (
                <div>
                    <br />
                    <p className={titleStyle}>{titleText + '  '}
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
                    <hr className={hrStlye} />
                    {/*Read-only properties*/}
                    <p className={classNames(leftAlign, headerStyle)}>Read-Only Properties</p>
                    <hr className={hrStlye} />
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
                    <hr className={hrStlye} />

                    {/*Editable properties*/}
                    <p className={classNames(leftAlign, headerStyle)}>Editable Properties</p>
                    {editablePropertyInputs}

                    {/*Buttons*/}
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
                    </form>
                </div>
            ) : (
                    <p>Fetching data</p>
                )
        );

    }
}
