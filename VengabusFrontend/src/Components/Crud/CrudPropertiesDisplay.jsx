import React, { Component } from 'react';
import { css } from 'emotion';
import classNames from 'classnames';
import { DataTable } from '../DataTable';
import { PropertyInput } from './PropertyInput';
import { InputLabel } from './InputLabel';
import { Spinner } from '../Spinner';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {object} endpointData The edited description of the endpoint.
 * @prop {object} endpointProperties And object with 'editable', 'setAtCreation' & 'readonly' properties, each of which is an Array of propertyConfig objects.
 * @prop {function} handlePropertyChange Function that is called when a property is changed in the form.
 */
export class CrudPropertiesDisplay extends Component {
    /**
     * @returns {node} Data table for read-only properties.
     */
    getReadOnlyPropertyTable = () => {
        const allProperties = this.props.endpointProperties;
        const readOnlyProperties = [...allProperties.readonly, ...allProperties.setAtCreation];
        const propsWithValues = readOnlyProperties.map(property => {
            return {
                name: property.displayLabel,
                value: this.props.endpointData[property.propertyName]
            };
        });

        const renderNullAsSpinner = (cell, row, rowIndex, formatExtraDataObject) => {
            if (cell === null) {
                return <Spinner size={8} />;
            } else {
                return cell;
            }
        };

        const colProps = [
            { dataField: 'name', text: 'Property Name', width: 20, headerStyle: { textAlign: 'left' } },
            { dataField: 'value', width: 80, headerStyle: { textAlign: 'left' }, formatter: renderNullAsSpinner }
        ];

        const tableStyle = css`
            width: 98%;
            padding-left: 20px;
        `;
        const rowStyle = css`
            text-align: left;
        `;

        return (
            <div className={tableStyle} >
                <DataTable
                    dataToDisplay={propsWithValues}
                    uniqueKeyColumn='name'
                    colProps={colProps}
                    rowClasses={rowStyle}
                    bordered={false}
                />
            </div>
        );
    }

    /**
     * @returns {node[]} Array of jsx elements for property inputs.
     */
    getEditablePropertyInputs = () => {
        const editableProperties = this.props.endpointProperties.editable;

        const editablePropertyInputs = [];
        for (let i = 0; i < editableProperties.length; i++) {
            const propertyConfig = editableProperties[i];
            const property = propertyConfig.propertyName;
            editablePropertyInputs.push(
                <div key={`input${i}`}>
                    <InputLabel
                        propertyName={propertyConfig.displayLabel}
                        tooltipText={propertyConfig.tooltipText}
                    />
                    <PropertyInput
                        propertyName={property}
                        inputData={this.props.endpointData[property]}
                        onChange={(data) => this.props.handlePropertyChange(data, property)}
                        complexInputComponentType={propertyConfig.component}
                        options={propertyConfig.dropdownValues}
                    />
                </div>
            );
        }
        return editablePropertyInputs;
    }

    render() {
        const hrStyle = css`
            color: black;
            background-color: black;
            height: 1px;
            width: 98%;
        `;

        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;

        const headerStyle = css`
            padding-top: 10px;
            font-weight: bold;
            font-size: 1.6em;
        `;

        const readOnlyPropertyTable = this.getReadOnlyPropertyTable();
        const editablePropertyInputs = this.getEditablePropertyInputs();
        const styledHr = (<hr className={hrStyle} />);
        return (
            <div>
                <p className={classNames(leftAlign, headerStyle)}>Read-Only Properties</p>
                {styledHr}
                {readOnlyPropertyTable}
                {styledHr}

                <p className={classNames(leftAlign, headerStyle)}>Editable Properties</p>
                {styledHr}
                {editablePropertyInputs}
                {styledHr}
            </div>
        );
    }
}