import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessagePropertyInput } from './MessagePropertyInput';
import {
    Button
} from "react-bootstrap";
import classNames from 'classnames';

export class MessageProperties extends Component {

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
        let preDefinedPropsButtonClassNames = classNames(buttonStyle, this.props.arePredefinedPropsLoaded || buttonLoading);
        const preDefinedPropertiesButtonText = this.props.arePredefinedPropsLoaded ? 'Add new Azure property' : 'Loading pre-defined properties...';
        const propertyChangeHandler = isPredefined ? this.props.handlePreDefinedPropertyChange : this.props.handleUserDefinedPropertyChange;
        return (
            <React.Fragment>
                <div className={leftAlign}>
                    <p className={headingStyle}>{(isPredefined ? "Pre" : "User") + "-defined Properties"}</p>
                </div>
                <MessagePropertyInput
                    properties={isPredefined ? this.props.preDefinedProperties : this.props.userDefinedProperties}
                    handlePropertyNameChange={(newName, index) => propertyChangeHandler(index, 'name', newName)}
                    handlePropertyValueChange={(newValue, index) => propertyChangeHandler(index, 'value', newValue)}
                    deleteRow={(index) => this.props.deleteRow(index, !isPredefined)}
                    permittedValues={isPredefined ? this.props.permittedValues : undefined}
                    reservedPropertyNames={isPredefined ? undefined : this.props.reservedPropertyNames}
                />
                <form>
                    <div className={leftAlign}>
                        <Button
                            className={isPredefined ? preDefinedPropsButtonClassNames : buttonStyle}
                            onClick={() => this.props.addNewProperty(!isPredefined)}
                        >
                            {isPredefined ? preDefinedPropertiesButtonText : "Add new application specific property"}
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
                {preDefinedPropertiesForm}
                <hr />
                {userDefinedPropertiesForm}
            </React.Fragment>
        );
    }

}
