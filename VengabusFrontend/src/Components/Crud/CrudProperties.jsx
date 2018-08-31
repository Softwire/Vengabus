import React, { Component } from 'react';
import { css } from 'emotion';
import classNames from 'classnames';
import { DataTable } from '../DataTable';
import { PropertyInput } from './PropertyInput';
import { TimeSpanInput } from './TimeSpanInput';
import { InputLabel } from './InputLabel';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {object} newEndpointData The edited description of the endpoint.
 * @prop {function} getEditableAndReadOnlyProperties Gets:
     *  {string[]} Property names for editable properties.
     *  {object} Display name and display value pairs for read-only properties.
 * @prop {function} handlePropertyChange Function that is called when a property is changed in the form.
 */
export class CrudProperties extends Component {

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
            enableDeadletteringOnMessageExpiration:
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
                        propertyName={property.charAt(0).toUpperCase() + property.substr(1)}
                        tooltipText={this.getTooltips()[property]}
                    />
                    <PropertyInput
                        inputData={this.props.newEndpointData[property]}
                        onChange={(data) => this.props.handlePropertyChange(data, property)}
                        complexInputComponentType={this.getObjectPropertyToComponent()[property]}
                        options={this.getDropdownOptions()[property]}
                    />
                </div>
            );
        }
        editablePropertyInputs.push(<hr className={this.getHrStyle()} key={1} />);
        return editablePropertyInputs;
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
                <p className={classNames(leftAlign, headerStyle)}>Read-Only Properties</p>
                {readOnlyPropertyTable}

                <p className={classNames(leftAlign, headerStyle)}>Editable Properties</p>
                {editablePropertyInputs}
            </div>
        );
    }
}