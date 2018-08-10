import React, { Component } from 'react';
import { css } from 'react-emotion';
import { MessagePropertyInput } from './MessagePropertyInput';
import {
    Button
} from "react-bootstrap";
import classNames from 'classnames';

export class MessageProperties extends Component {

    render() {
        const formStyle = css`
            margin-left: 5px;
            margin-right: 5px;
            padding-top: 1%;
            width: calc(100% - 10px); /* 10px total margin */
            float: left;
        `;
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
        const fullWidth = css`
            float: left;
            width: 100%;
        `;
        const buttonLoading = css`
            opacity: 0.5;
            :hover {
                cursor: progress;
            }
        `;
        let preDefinedPropsButtonClassNames = classNames(buttonStyle, this.props.arePredefinedPropsLoaded || buttonLoading);
        const preDefinedPropertiesButtonText = this.props.arePredefinedPropsLoaded ? 'Add new Azure property' : 'Loading pre-defined properties...';
        return (
            <React.Fragment>
                <hr className={fullWidth} />
                <div className={leftAlign}>
                    <p className={headingStyle}>Pre-defined Properties</p>
                </div>
                <MessagePropertyInput
                    properties={this.props.preDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.props.handlePreDefinedPropertyChange(index, 'name', newName)}
                    handlePropertyValueChange={(newValue, index) => this.props.handlePreDefinedPropertyChange(index, 'value', newValue)}
                    deleteRow={(index) => this.props.deleteRow(index, false)}
                    permittedValues={this.props.permittedValues}
                />
                <form>
                    <div className={leftAlign}>
                        <Button
                            className={preDefinedPropsButtonClassNames}
                            onClick={() => this.props.addNewProperty(false)}
                        >
                            {preDefinedPropertiesButtonText}
                        </Button>
                    </div>
                </form>
                <hr />
                <div className={leftAlign}>
                    <p className={headingStyle}>User-defined Properties</p>
                </div>
                <MessagePropertyInput
                    properties={this.props.userDefinedProperties}
                    handlePropertyNameChange={(newName, index) => this.props.handleUserDefinedPropertyChange(index, 'name', newName)}
                    handlePropertyValueChange={(newValue, index) => this.props.handleUserDefinedPropertyChange(index, 'value', newValue)}
                    deleteRow={(index) => this.props.deleteRow(index, true)}
                    reservedPropertyNames={this.props.reservedPropertyNames}
                />
                <form>
                    <div className={leftAlign}>
                        <Button
                            className={buttonStyle}
                            onClick={() => this.props.addNewProperty(true)}
                        >
                            Add new application specific property
                        </Button>
                    </div>
                </form>
            </React.Fragment>
        );
    }

}
