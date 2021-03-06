import React, { Component } from 'react';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { CopyTextButton } from '../Buttons/CopyTextButton';
import { css } from 'emotion';
import { CollapsiblePanel } from './CollapsiblePanel';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';
import { FormattingBox } from './FormattingBox';
import { DeleteSingleMessageButton } from '../Buttons/DeleteSingleMessageButton';
import { sharedSizesAndDimensions } from '../../Helpers/SharedSizesAndDimensions';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { NoPropertiesPanel } from './NoPropertiesPanel';
import { panelDarkGrey, panelLightGrey } from '../../colourScheme';
import { Spinner } from '../Spinner';
import { NotificationManager } from 'react-notifications';
import { DownloadMessagesFileButton } from '../Buttons/DownloadMessagesFileButton';

const defaultState = {
    spinner: false
};

export class MessageBox extends Component {
    constructor(props) {
        super(props);

        this.state = defaultState;
    }

    convertMessagePropertiesToJSXArray = (propertiesArray) => {
        const propertiesJSX = [];
        for (let propName in propertiesArray) {
            let currentPropValue = propertiesArray[propName];
            if (propName !== 'messageId') {
                propertiesJSX.push(
                    <p key={propName}>{propName + ': ' + String(currentPropValue)}</p> /*string conversion needed to display booleans properly*/
                );
            }
        }
        return propertiesJSX.length > 0 ? propertiesJSX : null;
    }

    handleReplayMessage = (message) => {
        if (this.props.endpointType === EndpointTypes.QUEUE) {
            pageSwitcher.switchToPage(
                PAGES.SendMessagePage,
                { message: message, recipientIsQueue: true, selectedQueue: this.props.endpointName }
            );
        } else {
            NotificationManager.warning("Original message is from a subscription. It will be replayed to its parent topic instead, as sending messages to a single subscription is unsupported.", "Warning", 5000);
            pageSwitcher.switchToPage(
                PAGES.SendMessagePage,
                { message: message, recipientIsQueue: false, selectedTopic: this.props.endpointParent }
            );
        }
    }

    closeMessageModalAndReloadMessageTable = () => {
        this.props.handleClose();
        if (this.props.onMessageBoxClose) {
            this.props.onMessageBoxClose();
        }
        this.setState(defaultState);
    }

    enableSpinner = () => {
        this.setState({ spinner: true });
    }

    render() {
        const buttonToolbarStyle = css`
            margin-right: -8px; /* This counteracts the right margin for the "first" (right-most) button. See comment below. */
            
            &.btn-toolbar .btn {
                margin-right: 8px; /* The tooltip library's layout code doesn't handle margins, so we have to have the margin on the right. */
                margin-left: 0px;
                float: right;
            }
        `;
        const headerStyle = css`
            font-weight: bold;
            display: inline-block;
        `;
        const messageIdStyle = css`
            display: inline-block;
        `;
        const panelStyle = css`
            .panel {
                margin-bottom: 15px;
                .panel-heading {
                    padding: 0 15px;
                    color: ${panelDarkGrey};
                    border-color: ${panelLightGrey};
                    pre {
                        white-space: pre-wrap; /*word wrap on narrow displays*/
                    }
                    overflow: auto;             
                    background-image: linear-gradient(to bottom,#f5f5f5 0,#e8e8e8 100%); /*background colouru*/
                    background-repeat: repeat-x;
                }
                .panel-body { 
                    padding: 0;
                }
                pre {
                    border: none;
                    margin: 0; 
                }
            }
        `;
        const message = this.props.message;
        if (!message) {
            return null;
        }
        const messageBoxWidth = 750;
        const modalStyle = css`
            @media only screen and (min-width: ${messageBoxWidth}px) {
                .modal-dialog {
                    max-width: ${messageBoxWidth}px;
                    width: 100%;
                }
            }
            @media only screen and (max-width: ${messageBoxWidth}px) {
                .modal-dialog {
                    width: auto;                
                }
            }
            .modal-dialog {
                margin: 30px auto
            }
            .modal-content {
                overflow: auto;
                max-height: ${sharedSizesAndDimensions.MESSAGEBOX_MODAL_HEIGHT}vh; 
            } 
        `;

        let preDefinedPropsJSX = this.convertMessagePropertiesToJSXArray(message.predefinedProperties);
        let PreDefinedPanelType = CollapsiblePanel;
        if (!preDefinedPropsJSX) {
            preDefinedPropsJSX = <p>There are no user-defined properties to display</p>;
            PreDefinedPanelType = NoPropertiesPanel;
        }
        let customPropsJSX = this.convertMessagePropertiesToJSXArray(message.customProperties);
        let CustomPanelType = CollapsiblePanel;
        if (!customPropsJSX) {
            customPropsJSX = <p>There are no user-defined properties to display</p>;
            CustomPanelType = NoPropertiesPanel;
        }

        const replayDestination = this.props.endpointType === EndpointTypes.QUEUE ? this.props.endpointName : this.props.endpointParent;
        const modalBody = (
            <React.Fragment>
                <PreDefinedPanelType panelTitle={"Pre-defined Properties"}>
                    <pre>{preDefinedPropsJSX}</pre>
                </PreDefinedPanelType>
                <CustomPanelType panelTitle={"User-defined Properties"}>
                    <pre>{customPropsJSX}</pre>
                </CustomPanelType>
                <FormattingBox message={message.messageBody} />
            </React.Fragment>);
        const spinner = <Spinner size={25} />;
        const buttonsDisabled = this.state.spinner;
        
        return (
            <div className="static-modal" >
                <Modal show={this.props.show} onHide={this.props.handleClose} className={modalStyle} id="messageBoxModal" >
                    <Modal.Header>
                        <Modal.Title className={headerStyle}>Message Id:&nbsp;</Modal.Title>
                        <Modal.Title className={messageIdStyle}>{message.predefinedProperties.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className={panelStyle} id="messageBoxModalBody">
                        {this.state.spinner ? spinner : modalBody}
                    </Modal.Body>

                    <Modal.Footer>
                        <ButtonToolbar className={buttonToolbarStyle}>
                            { /*Note that these buttons are rendered in order, Right-to-Left*/}
                            <Button disabled={buttonsDisabled} onClick={this.props.handleClose} id="messageBoxClose">Close</Button>
                            <DeleteSingleMessageButton
                                uniqueId={message.uniqueId}
                                messageId={message.predefinedProperties.messageId}
                                endpointType={this.props.endpointType}
                                messageType={this.props.messageType}
                                parentName={this.props.endpointParent}
                                endpointName={this.props.endpointName}
                                onDeletionEnd={this.closeMessageModalAndReloadMessageTable}
                                onDeletionStart={this.enableSpinner}
                                disabled={buttonsDisabled}
                            />
                            <CopyTextButton disabled={buttonsDisabled} text={message.messageBody} id="messageBoxCopy" />
                            <DownloadMessagesFileButton
                                getMessages={() => Promise.resolve([message])}
                                downloadButtonText="Download"
                                fileName={"message_" + message.predefinedProperties.messageId}
                                disabled={buttonsDisabled}
                                id="messageBoxDownloadMessageButton"
                            />
                            <Button disabled={buttonsDisabled} onClick={() => this.handleReplayMessage(message)} id="messageBoxReplayMessage">{"Replay Message to " + replayDestination}</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}