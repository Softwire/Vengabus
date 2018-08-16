import React, { Component } from 'react';
import { Tooltip } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { css } from 'emotion';
import classNames from 'classnames';
import { DataTable } from '../Components/DataTable';
import moment from 'moment';
import { PropertyInput } from '../Components/PropertyInput';
import { TimeSpanInput } from '../Components/TimeSpanInput';
import { ButtonWithConfirmationModal } from '../Components/ButtonWithConfirmationModal';

export class EditQueuesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueue: "mkdemoqueue",
            queueData: {},
            newQueueData: {},
            receivedData: false
        };
    }

    componentDidMount = () => {
        serviceBusConnection.getServiceBusService().getQueueDetails(this.state.selectedQueue)
            .then((result) => {
                result.autoDeleteOnIdle = this.parseTimeSpanFromBackend(result.autoDeleteOnIdle);
                this.setState({ queueData: result, newQueueData: result, receivedData: true });
            });
    }

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
        return [leftAlign, hrStlye, headerStyle, tableStyle, rowStyle, buttonFormStyle];
    }

    getTooltips = () => {
        return {
            requiresSession: <Tooltip id="tooltip">
                True if the receiver application can only receive from the queue through a MessageSession; false if a queue cannot receive using MessageSession.
            </Tooltip>
        };
    }

    /**
     * @returns {string[]} Property names for editable properties.
     * @returns {object} Display name and display value pairs for read-only properties.
     */
    getEditableAndReadOnlyProperties = () => {
        const { name, activeMessageCount, deadletterMessageCount, mostRecentDeadLetter } = this.state.newQueueData;
        const readOnlyProperties = this.assembleReadOnlyProperties({
            // text in the left column: key to value in the right column
            "Name": name,
            "Active Message Count": activeMessageCount,
            "Dead Letter Message Count": deadletterMessageCount,
            "Most Recent Dead Letter": mostRecentDeadLetter
        });
        const editableProperties = [
            'supportOrdering',
            'requiresSession',
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
        const tooltips = this.getTooltips();
        const objectPropertyToComponent = {
            'autoDeleteOnIdle': TimeSpanInput
        };
        let editablePropertyInputs = [];
        for (let i = 0; i < editableProperties.length; i++) {
            const property = editableProperties[i];
            editablePropertyInputs.push(<hr className={this.getHrStyle()} key={i} />);
            editablePropertyInputs.push(
                <PropertyInput
                    text={property.charAt(0).toUpperCase() + property.substr(1)}
                    data={this.state.newQueueData[property]}
                    tooltip={tooltips[property]}
                    onChange={(data) => this.handlePropertyChange(data, property)}
                    componentType={objectPropertyToComponent[property]}
                    key={`propertyInput${i}`}
                />
            );
        }
        editablePropertyInputs.push(<hr className={this.getHrStyle()} key={editableProperties.length} />);
        return editablePropertyInputs;
    }

    handlePropertyChange(value, property) {
        const updatedNewQueueData = { ...this.state.newQueueData };
        updatedNewQueueData[property] = value;
        this.setState({
            newQueueData: updatedNewQueueData
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

    updateQueue = () => {
        const queueToSend = { ...this.state.newQueueData };
        console.log(queueToSend);
        serviceBusConnection.getServiceBusService().updateQueue(this.state.newQueueData);
    }

    resetFields = () => {
        this.setState({
            newQueueData: this.state.queueData
        });
    }

    render() {
        const colProps = [{ dataField: 'name', text: 'Property Name', headerStyle: { textAlign: 'left' } }, { dataField: 'value', headerStyle: { textAlign: 'left' } }];
        const [leftAlign, hrStlye, headerStyle, tableStyle, rowStyle, buttonFormStyle] = this.getStyles();
        const [editableProperties, readOnlyProperties] = this.getEditableAndReadOnlyProperties();
        const editablePropertyInputs = this.getEditablePropertyInputs(editableProperties);

        return (
            this.state.receivedData ? (
                <div>
                    <br />
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

                    {/*Editable properties*/}
                    <p className={classNames(leftAlign, headerStyle)}>Editable Properties</p>
                    {editablePropertyInputs}

                    {/*Buttons*/}
                    <form className={buttonFormStyle}>
                        <ButtonWithConfirmationModal
                            id="submitButton"
                            buttonText={"Update"}
                            buttonStyle="default"
                            buttonDisabled={this.checkObjectEquality(this.state.queueData, this.state.newQueueData)}
                            modalTitle={"Update Queue"}
                            modalBody={
                                <React.Fragment>
                                    <p>{"Following queue will be updated: " + this.state.selectedQueue}</p>
                                    <p>{"Confirm action?"}</p>
                                </React.Fragment>
                            }
                            confirmButtonText={"Update"}
                            confirmAction={this.updateQueue}
                        />
                        <ButtonWithConfirmationModal
                            id="resetButton"
                            buttonText={"Reset Fields"}
                            buttonDisabled={this.checkObjectEquality(this.state.queueData, this.state.newQueueData)}
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
