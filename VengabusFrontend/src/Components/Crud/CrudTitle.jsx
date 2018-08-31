import React, { Component } from 'react';
import { ButtonWithConfirmationModal } from '../Buttons/ButtonWithConfirmationModal';
import { PurgeMessagesButton } from '../Buttons/PurgeMessagesButton';
import { FormControl, FormGroup, ButtonGroup } from 'react-bootstrap';
import { css } from 'emotion';
import { DownloadEndpointButton } from '../Buttons/DownloadEndpointButton';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { UploadMessagesToEndpointButton } from '../UploadMessagesToEndpointButton';

/**
 * @prop {string} endpointType The type of endpoint we are editing. Use EndpointTypes in Helpers.
 * @prop {string} selectedEndpoint Name of the selected endpoint.
 * @prop {boolean} renameDisabled If true then the endpoint cannot be renamed.
 * @prop {string} parentTopic The parent topic of the subscription being edited. Only required for subscriptions.
 * @prop {function} renameEndpoint Function that renames the endpoint when called.
 * @prop {function} deleteEndpoint Function that deletes the selected endpoint when called.
 */
export class CrudTitle extends Component {
    render() {
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

        let downloadButton;

        if(this.props.endpointType === EndpointTypes.QUEUE || this.props.endpointType === EndpointTypes.SUBSCRIPTION) {
            downloadButton = (
                <DownloadEndpointButton
                    parentTopic={this.props.parentTopic}
                    endpointType={this.props.endpointType}
                    endpointName={this.props.selectedEndpoint}
                />);
        }

        let uploadButton;
        if (this.props.endpointType === EndpointTypes.QUEUE || this.props.endpointType === EndpointTypes.TOPIC) {
            uploadButton = (
                <UploadMessagesToEndpointButton
                    parentTopic={this.props.parentTopic}
                    endpointType={this.props.endpointType}
                    endpointName={this.props.selectedEndpoint}
                    ready="true"
                    text={"Upload file of messages to " + this.props.selectedEndpoint}
                />);
        }
        return (
            <div className={titleStyle}>
                <span>{titleText + '  '}</span>
                <ButtonGroup>
                    <ButtonWithConfirmationModal
                        id="renameButton"
                        buttonText={"Rename"}
                        buttonStyle="primary"
                        modalInternalStyle="info"
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
                        confirmAction={() => this.props.renameEndpoint(this.props.selectedEndpoint, this.newName)}
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
                    <PurgeMessagesButton id="purgeLiveMessages" messageType={EndpointTypes.MESSAGE} type={this.props.endpointType} endpointName={this.props.selectedEndpoint} parentName={this.props.parentTopic} />
                    <PurgeMessagesButton id="purgeDeadletterMessages" messageType={EndpointTypes.DEADLETTER} type={this.props.endpointType} endpointName={this.props.selectedEndpoint} parentName={this.props.parentTopic} />
                    {downloadButton}
                </ButtonGroup>
                {uploadButton}
                <hr className={hrStyle} />
            </div>
        );
    }
}