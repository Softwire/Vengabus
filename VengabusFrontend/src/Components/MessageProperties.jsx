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
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     * @param {funciton} updateOperation The operation to be applied to the properties collection.
     */
    updatePropertiesCollection = (isUserDefined, updateOperation) => {
        const propertyType = isUserDefined ? "userDefinedProperties" : "preDefinedProperties";
        const newProperties = [...this.props[propertyType]];
        updateOperation(newProperties);
        this.props.handlePropertiesChange(propertyType, newProperties);
    };

    /**
     * Adds a new property to the list of user-defined properties.
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     */
    addNewProperty = (isUserDefined) => {
        this.updatePropertiesCollection(isUserDefined, (propertyCollectionToMutate) => {
            propertyCollectionToMutate.push({ name: "", value: "" });
        });
    }

    /**
     * Deletes a row from the list of user defined properties.
     * @param {integer} index The index of the row to delete.
     * @param {boolean} isUserDefined Should be true if the property is user-defined, false if it is a pre-defined property.
     */
    deleteRow = (index, isUserDefined) => {
        this.updatePropertiesCollection(isUserDefined, (propertyCollectionToMutate) => {
            propertyCollectionToMutate.splice(index, 1);
        });
    };

    handlePropertiesEdit = (isPreDefined, position, attribute, newValue) => {
        const propertyType = isPreDefined ? "preDefinedProperties" : "userDefinedProperties";
        const newProperties = [...this.props[propertyType]];
        newProperties[position][attribute] = newValue;
        this.props.handlePropertiesChange(propertyType, newProperties);
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
            opacity: 0.5;
            :hover {
                cursor: progress;
            }
        `;
        let preDefinedPropsButtonClassNames = classNames(buttonStyle, this.props.arePreDefinedPropsLoaded || buttonLoading);
        const addPropertyText = isPredefined ? 'Add new Azure property' : 'Add new application specific property';
        const arePropertiesLoaded = !isPredefined || this.props.arePreDefinedPropsLoaded;
        return (
            <React.Fragment>
                <div className={leftAlign}>
                    <p className={headingStyle}>{(isPredefined ? "Pre" : "User") + "-defined Properties"}</p>
                </div>
                <MessagePropertyInput
                    properties={isPredefined ? this.props.preDefinedProperties : this.props.userDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.handlePropertiesEdit(isPredefined, index, 'name', newName)}
                    handlePropertyValueChange={(newValue, index) => this.handlePropertiesEdit(isPredefined, index, 'value', newValue)}
                    deleteRow={(index) => this.deleteRow(index, !isPredefined)}
                    permittedValues={isPredefined ? this.props.permittedValues : undefined}
                    reservedPropertyNames={isPredefined ? undefined : this.props.reservedPropertyNames}
                />
                <form>
                    <div className={leftAlign}>
                        <Button
                            className={isPredefined ? preDefinedPropsButtonClassNames : buttonStyle}
                            onClick={() => this.addNewProperty(!isPredefined)}
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
