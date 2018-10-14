import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessagePropertyInput } from './MessagePropertyInput';
import {
    Button
} from "react-bootstrap";
import classNames from 'classnames';

export class MessageProperties extends Component {

    /**
     * Updates a collection of properties by applying the given updateOperation to it.
     * @param {boolean} isPreDefined Should be true if the property is pre-defined, false if it is a user-defined property.
     * @param {function} updateOperation The operation to be applied to the properties collection.
     */
    updatePropertiesCollection = (isPreDefined, updateOperation) => {
        const propertyType = isPreDefined ? "preDefinedProperties" : "userDefinedProperties";
        const newProperties = [...this.props[propertyType]];
        updateOperation(newProperties);
        this.props.handlePropertiesChange(propertyType, newProperties);
    };

    /**
     * Adds a new property to the list of user-defined properties.
     * @param {boolean} isPreDefined Should be true if the property is pre-defined, false if it is a user-defined property.
     */
    addNewProperty = (isPreDefined) => {
        this.updatePropertiesCollection(isPreDefined, (propertyCollectionToMutate) => {
            propertyCollectionToMutate.push({ name: "", value: "" });
        });
    }

    /**
     * Deletes a row from the list of user defined properties.
     * @param {integer} index The index of the row to delete.
     * @param {boolean} isPreDefined Should be true if the property is pre-defined, false if it is a user-defined property.
     */
    deleteRow = (index, isPreDefined) => {
        this.updatePropertiesCollection(isPreDefined, (propertyCollectionToMutate) => {
            propertyCollectionToMutate.splice(index, 1);
        });
    };

    handlePropertiesEdit = (isPreDefined, position, attribute, newValue) => {
        this.updatePropertiesCollection(isPreDefined, (propertyCollectionToMutate) => {
            propertyCollectionToMutate[position][attribute] = newValue;
        });
    }

    renderMessagePropertyInput = (isPredefined) => {
        const buttonStyle = css`
            width: 270px;
            margin-left: 5px;
        `;
        const headingStyle = css`
            font-weight: bold;
            margin-left: 5px;
        `;
        const leftAlign = css`
            text-align:left;
        `;
        const buttonLoading = css`
            &.btn:hover {
                cursor: progress;
            }
        `;
        let preDefinedPropsButtonClassNames = classNames(buttonStyle, this.props.hasLoadedPermittedPreDefinedProps || buttonLoading);
        const addPropertyText = isPredefined ? 'Add new Azure property' : 'Add new application specific property';
        const arePropertiesLoaded = !isPredefined || this.props.hasLoadedPermittedPreDefinedProps;
        return (
            <React.Fragment>
                <div className={leftAlign}>
                    <p className={headingStyle}>{(isPredefined ? "Pre" : "User") + "-defined Properties"}</p>
                </div>
                <MessagePropertyInput
                    properties={isPredefined ? this.props.preDefinedProperties : this.props.userDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.handlePropertiesEdit(isPredefined, index, 'name', newName)}
                    handlePropertyValueChange={(newValue, index) => this.handlePropertiesEdit(isPredefined, index, 'value', newValue)}
                    deleteRow={(index) => this.deleteRow(index, isPredefined)}
                    permittedValues={isPredefined ? this.props.permittedPreDefinedValues : undefined}
                    reservedPropertyNames={isPredefined ? undefined : this.props.reservedPropertyNames}
                    reportWarnings={this.props.reportWarnings}
                />
                <form>
                    <div className={leftAlign}>
                        <Button
                            id={isPredefined ? 'addPreDefinedPropertyButton' : 'addUserDefinedPropertyButton'}
                            className={isPredefined ? preDefinedPropsButtonClassNames : buttonStyle}
                            disabled={!arePropertiesLoaded}
                            onClick={() => this.addNewProperty(isPredefined)}
                        >
                            {arePropertiesLoaded ? addPropertyText : 'Loading pre-defined properties...'}
                        </Button>
                    </div>
                </form>
            </React.Fragment>
        );
    }

    render() {
        let preDefinedPropertiesInput = this.renderMessagePropertyInput(true);
        let userDefinedPropertiesInput = this.renderMessagePropertyInput(false);
        return (
            <React.Fragment>
                {preDefinedPropertiesInput}
                <hr />
                {userDefinedPropertiesInput}
            </React.Fragment>
        );
    }

}
