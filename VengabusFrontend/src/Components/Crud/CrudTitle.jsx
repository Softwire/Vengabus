import React, { Component } from 'react';
import { ButtonWithConfirmationModal } from '../ButtonWithConfirmationModal';
import { PurgeMessagesButton } from '../PurgeMessagesButton';
import { FormControl, FormGroup, ButtonGroup } from 'react-bootstrap';
import { css } from 'emotion';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {string} selectedEndpoint Name of the selected endpoint.
 * @prop {boolean} renameDisabled If true then the endpoint cannot be renamed.
 * @prop {string} parentTopic The parent topic of the subscription being edited. Only required for subscriptions.
 * @prop {function} renameEndpoint Function that renames the endpoint when called.
 * @prop {function} deleteEndpoint Function that deletes the selected endpoint when called.
 */
export class CrudTitle extends Component {
    render(){
        const titleText = `Editing ${this.props.endpointType}: ${this.props.selectedEndpoint}`;
        const titleStyle = css`
            font-size: 2em;
            font-weight: bold;
            text-align: center;
        `;
        const hrStyle = css`
            color: black;
            background-color: black;
            height: 1px;
            width: 98%;
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
                        buttonDisabled={this.props.renameDisabled}
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
                                <p>This will irreversibly delete this {this.props.endpointType}</p>
                        }
                        confirmButtonText={"Delete"}
                        confirmAction={this.props.deleteEndpoint}
                    />
                    <PurgeMessagesButton id="purgeMessages" type={this.props.endpointType} endpointName={this.props.selectedEndpoint} parentName={this.props.parentTopic} />
                </ButtonGroup>
                <hr className={hrStyle} />
            </div>
        );
    }
}