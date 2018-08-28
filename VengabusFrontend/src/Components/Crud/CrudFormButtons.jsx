import React, { Component } from 'react';
import { css } from 'emotion';
import { ButtonGroup } from 'react-bootstrap';
import { ButtonWithConfirmationModal } from '../ButtonWithConfirmationModal';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {string} selectedEndpoint Name of the selected endpoint.
 * @prop {boolean} buttonsDisabled  If true then these buttons are disabled.
 * @prop {function} updateEndpoint Function that updates the endpoint.
 * @prop {function} resetFields Function that resets the input fields to their original value when called.
 */
export class CrudFormButtons extends Component {

    render() {
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
                        modalInternalStyle="info"
                        buttonDisabled={this.props.buttonsDisabled}
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
                        buttonDisabled={this.props.buttonsDisabled}
                        modalInternalStyle="warning"
                        modalTitle={"Reset all fields"}
                        modalBody={
                            <React.Fragment>
                                <p>Are you sure you want to reset ALL fields of the current {this.props.endpointType}?</p>
                                <p>Note: resetting the fields here will have NO effect on the {this.props.endpointType} in Azure.</p>
                            </React.Fragment>
                        }
                        confirmButtonText={"Reset"}
                        confirmAction={this.props.resetFields}
                    />
                </ButtonGroup>
            </form>
        );
    }
}