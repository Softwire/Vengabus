import React, { Component } from 'react';
import _ from 'lodash';
import { CrudTitle } from './CrudTitle';
import { CrudPropertiesDisplay } from './CrudPropertiesDisplay';
import { CrudFormButtons } from './CrudFormButtons';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {string} selectedEndpoint Name of the selected endpoint.
 * @prop {string} parentTopic The parent topic of the subscription being edited. Only required for subscriptions.
 * @prop {object} endpointData The description of the endpoint.
 * @prop {object} endpointProperties And object with 'editable', 'setAtCreation' & 'readonly' properties, each of which is an Array of propertyConfig objects.
 * @prop {object} endpointCrudService Object of {rename(oldName, newName), update(endpointData), delete(name)}
 */
export class CrudInterface extends Component {
    constructor(props) {
        super(props);
        const data = this.props.endpointData;
        this.state = {
            originalEndpointData: { ...data },
            newEndpointData: { ...data },
        };
    }
    /*
        We capture the endpointData prop in the constructor. If it ever changes, then we need to update our copy of it.
        We're happy to lose any local changes when this happens - that's not a concern.
    */
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.resetDataState(nextProps.endpointData);
    }

    /**
     * Updates EndpointData for a particular property
     * @param {object} value New Value to be used.
     * @param {string} property Name of property to be updated.
     * @returns {void}
     */
    handlePropertyChange = (value, property) => {
        this.setState((oldState) => {
            oldState.newEndpointData[property] = value;
            return oldState;
        });
    }

    /**
     * Updates name of the endpoint
     * @param {string} newName New Name
     * @returns {Promise} Indicating completion of rename in Azure
     */
    renameEndpoint = (newName) => {
        const renamePromise = this.props.endpointCrudService.renameQueue(this.state.originalEndpointData.name, newName);
        const completionPromise = renamePromise.then(() => {
            this.setState((oldState) => {
                oldState.originalEndpointData.name = newName;
                oldState.newEndpointData.name = newName;
                return oldState;
            });
        });
        return completionPromise;
    }

    /**
     * Updates config of the endpoint, from the current state of the Endpoint Data.
     * @returns {Promise} Indicating completion of update in Azure
     */
    updateEndpoint = () => {
        const updatePromise = this.props.endpointCrudService.update(this.state.newEndpointData);
        const completionPromise = updatePromise.then(() => {
            this.resetDataState(this.state.newEndpointData);
        });
        return completionPromise;
    }

    /**
     * Reverts all current data back to the last point at which is was sent/received from Azure.
     * @returns {void}
     */
    resetFields = () => {
        this.resetDataState(this.state.originalEndpointData);
    }

    /**
     * Overwrites all data with the provided version.
     * @param {object} endpointData The endpointData with whicih to override current state (both old and new)
     * @returns {void}
     */
    resetDataState = (endpointData) => {
        this.setState({
            originalEndpointData: { ...endpointData },
            newEndpointData: { ...endpointData },
        });
    }

    /**
     * Deletes the current endpoint and redirects to the home page.
     * @returns {Promise} Indicating completion of delete in Azure
     */
    deleteEndpoint = () => {
        const deletionPromise = this.props.endpointCrudService.delete(this.props.selectedEndpoint);
        deletionPromise.then(() => {
            pageSwitcher.switchToPage(PAGES.HomePage);
        });
        return deletionPromise;
    }

    render() {
        return (
            <div>
                <br />
                <CrudTitle
                    endpointType={this.props.endpointType}
                    selectedEndpoint={this.props.selectedEndpoint}
                    parentTopic={this.props.parentTopic}
                    renameDisabled={this.state.originalEndpointData.enablePartitioning}
                    renameEndpoint={this.renameEndpoint}
                    deleteEndpoint={this.deleteEndpoint}
                />
                <CrudPropertiesDisplay
                    endpointType={this.props.endpointType}
                    newEndpointData={this.state.newEndpointData}
                    endpointProperties={this.props.endpointProperties}
                    handlePropertyChange={this.handlePropertyChange}
                />
                <CrudFormButtons
                    endpointType={this.props.endpointType}
                    selectedEndpoint={this.props.selectedEndpoint}
                    buttonsDisabled={_.isEqual(this.state.originalEndpointData, this.state.newEndpointData)}
                    updateEndpoint={this.updateEndpoint}
                    resetFields={this.resetFields}
                />
            </div>
        );

    }
}
