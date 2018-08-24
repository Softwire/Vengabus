import React, { Component } from 'react';
import _ from 'lodash';
import { CrudTitle } from './CrudTitle';
import { CrudProperties } from './CrudProperties';
import { CrudFormButtons } from './CrudFormButtons';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {string} selectedEndpoint Name of the selected endpoint.
 * @prop {string} parentTopic The parent topic of the subscription being edited. Only required for subscriptions.
 * @prop {object} endpointData The original description of the endpoint.
 * @prop {object} newEndpointData The edited description of the endpoint.
 * @prop {function} getEditableAndReadOnlyProperties Gets:
     *  {string[]} Property names for editable properties.
     *  {object} Display name and display value pairs for read-only properties.
 * @prop {function} handlePropertyChange Function that is called when a property is changed in the form.
 * @prop {function} renameEndpoint  Function that renames the endpoint when called.
 * @prop {function} updateEndpoint Function that updates the endpoint to what is defined in newEndpointData.
 * @prop {function} deleteEndpoint Function that deletes the selected endpoint when called.
 * @prop {function} resetFields Function that resets the input fields to their original value when called.
 */
export class CrudInterface extends Component {

    render() {
        return (
            <div>
                <br />
                <CrudTitle
                    endpointType={this.props.endpointType}
                    selectedEndpoint={this.props.selectedEndpoint}
                    parentTopic={this.props.parentTopic}
                    renameDisabled={this.props.endpointData.enablePartitioning}
                    renameEndpoint={this.props.renameEndpoint}
                    deleteEndpoint={this.props.deleteEndpoint}
                />
                <CrudProperties
                    endpointType={this.props.endpointType}
                    newEndpointData={this.props.newEndpointData}
                    getEditableAndReadOnlyProperties={this.props.getEditableAndReadOnlyProperties}
                    handlePropertyChange={this.props.handlePropertyChange}
                />
                <CrudFormButtons
                    endpointType={this.props.endpointType}
                    selectedEndpoint={this.props.selectedEndpoint}
                    buttonsDisabled={_.isEqual(this.props.endpointData, this.props.newEndpointData)}
                    updateEndpoint={this.props.updateEndpoint}
                    resetFields={this.props.resetFields}
                />
            </div>
        );

    }
}
