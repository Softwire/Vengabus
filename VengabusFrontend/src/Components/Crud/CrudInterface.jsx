import React, { Component } from 'react';
import { css } from 'emotion';
import classNames from 'classnames';
import { FormControl, FormGroup, ButtonGroup } from 'react-bootstrap';
import { DataTable } from '../DataTable';
import { PropertyInput } from './PropertyInput';
import { TimeSpanInput } from './TimeSpanInput';
import { InputLabel } from './InputLabel';
import { ButtonWithConfirmationModal } from '../ButtonWithConfirmationModal';
import { PurgeMessagesButton } from '../PurgeMessagesButton';
import _ from 'lodash';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in helpers.
 * @prop {string} selectedEndpoint The name of the endpoint being edited.
 * @prop {string} parentTopic The parent topic of the subscription being edited. Only required for subscriptions.
 * @prop {object} endpointData
 * @prop {object} newEndpointData
 * @prop {function} getEditableAndReadOnlyProperties
 * @prop {function} handlePropertyChange
 * @prop {function} renameEndpoint
 * @prop {function} updateEndpoint
 * @prop {function} deleteEndpoint
 * @prop {function} resetFields
 */
export class CrudInterface extends Component {

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
     * @returns {Object <string, string>} Maps from property name to text to be displayed on info hover over.
     */
    getTooltips = () => {
        return {
            requiresSession:
                `True if the receiver application can only receive from the ${this.props.endpointType} through a MessageSession; false if a ${this.props.endpointType} cannot receive using MessageSession.`,
            autoDeleteOnIdle:
                `The idle time span after which the ${this.props.endpointType} is automatically deleted. The minimum duration is 5 minutes.`,
            maxDeliveryCount:
                'A message is automatically deadlettered after this number of deliveries.',
            enableDeadLetteringOnMessageExpiration:
                `Sets whether this ${this.props.endpointType} has dead letter support when a message expires.`
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
        const [editableProperties, readOnlyProperties] = this.props.getEditableAndReadOnlyProperties();
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
                    />
                </div>
                <hr className={this.getHrStyle()} />
            </div>;
        return [editablePropertyInputs, readOnlyPropertyTable];
    }

    /**
     * @param {string[]} editableProperties Property names for editable properties.
     * @returns {node[]} Array of jsx elements for property inputs.
     */
    getEditablePropertyInputs = (editableProperties) => {
        let editablePropertyInputs = [];
        editablePropertyInputs.push(<hr className={this.getHrStyle()} key={0} />);
        for (let i = 0; i < editableProperties.length; i++) {
            const property = editableProperties[i];
            editablePropertyInputs.push(
                <div key={`input${i}`}>
                    <InputLabel
                        text={property.charAt(0).toUpperCase() + property.substr(1)}
                        tooltip={this.getTooltips()[property]}
                    />
                    <PropertyInput
                        data={this.props.newEndpointData[property]}
                        onChange={(data) => this.props.handlePropertyChange(data, property)}
                        componentType={this.getObjectPropertyToComponent()[property]}
                        options={this.getDropdownOptions()[property]}
                    />
                </div>
            );
        }
        editablePropertyInputs.push(<hr className={this.getHrStyle()} key={1} />);
        return editablePropertyInputs;
    }

    /**
     * @returns {node} Title component.
     */
    getTitle = () => {
        const titleText = `Editing ${this.props.endpointType}: ${this.props.selectedEndpoint}`;
        const titleStyle = css`
            font-size: 2em;
            font-weight: bold;
            text-align: center;
        `;
        return (
            <div className={titleStyle}>
                <span>{titleText + '  '}</span>
                <ButtonGroup>
                    <ButtonWithConfirmationModal
                        id="renameButton"
                        buttonText={"Rename"}
                        buttonStyle="primary"
                        modalTitle={"Rename " + this.props.selectedEndpoint}
                        buttonDisabled={this.props.endpointData.enablePartitioning}
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
                        confirmAction={this.props.renameEndpoint}
                    />
                    <ButtonWithConfirmationModal
                        id="deleteButton"
                        buttonText={"Delete " + this.props.endpointType}
                        buttonStyle="danger"
                        modalTitle={"Delete " + this.props.selectedEndpoint}
                        modalBody={
                            <React.Fragment>
                                <p>This will irreversibly delete this {this.props.endpointType}</p>
                            </React.Fragment>
                        }
                        confirmButtonText={"Delete"}
                        confirmAction={this.props.deleteEndpoint}
                    />
                    <PurgeMessagesButton id="purgeMessages" type={this.props.endpointType} endpointName={this.props.selectedEndpoint} parentName={this.props.parentTopic} />
                </ButtonGroup>
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
                <ButtonGroup>
                    <ButtonWithConfirmationModal
                        id="updateButton"
                        buttonText={"Update"}
                        buttonStyle="default"
                        buttonDisabled={_.isEqual(this.props.endpointData, this.props.newEndpointData)}
                        modalTitle={"Update " + this.props.endpointType}
                        modalBody={
                            <React.Fragment>
                                <p>{"Following " + this.props.endpointType + " will be updated: " + this.props.selectedEndpoint}</p>
                                <p>{"Confirm action?"}</p>
                            </React.Fragment>
                        }
                        confirmButtonText={"Update"}
                        confirmAction={this.props.updateEndpoint}
                    />
                    <ButtonWithConfirmationModal
                        id="resetButton"
                        buttonText={"Reset Fields"}
                        buttonDisabled={_.isEqual(this.props.endpointData, this.props.newEndpointData)}
                        modalTitle={"Reset all fields"}
                        modalBody={
                            <React.Fragment>
                                <p>Are you sure you want to reset ALL fields of the current {this.props.endpointType}?</p>
                                <p>Note: if you are updating an existing {this.props.endpointType}, resetting the fields here will have NO effect on the orignal {this.props.endpointType}.</p>
                            </React.Fragment>
                        }
                        confirmButtonText={"Reset"}
                        confirmAction={this.props.resetFields}
                    />
                </ButtonGroup>
            </form>
        );
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
        let [editablePropertyInputs, readOnlyPropertyTable] = this.getEditableAndReadOnlyPropertyComponents();

        return (
            <div>
                <br />
                {this.getTitle()}

                <p className={classNames(leftAlign, headerStyle)}>Read-Only Properties</p>
                {readOnlyPropertyTable}

                <p className={classNames(leftAlign, headerStyle)}>Editable Properties</p>
                {editablePropertyInputs}

                {this.getFormButtons()}
            </div>
        );

    }
}
