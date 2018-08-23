import React, { Component } from 'react';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { CopyTextButton } from '../CopyTextButton';
import { css } from 'emotion';
import { CollapsiblePanel } from '../CollapsiblePanel';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';
import { FormattingBox } from './FormattingBox';
import { DeleteSingleMessageButton } from '../../Components/DeleteSingleMessageButton';
import { sharedSizesAndDimensions } from '../../Helpers/SharedSizesAndDimensions';
import { EndpointTypes } from '../../Helpers/EndpointTypes';

export class MessageBox extends Component {

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
            pageSwitcher.switchToPage(
                PAGES.SendMessagePage,
                { message: message, recipientIsQueue: false, selectedTopic: this.props.endpointParent }
            );
        }
    }

    closeMessageModalAndReloadMessageTable = () => {
        this.props.handleClose();
        if (this.props.refreshMessageTableHandler) {
            this.props.refreshMessageTableHandler();
        }
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
        const preDefinedPropsJSX = this.convertMessagePropertiesToJSXArray(message.predefinedProperties) || <p>There are no pre-defined properties to display</p>;
        const customPropsJSX = this.convertMessagePropertiesToJSXArray(message.customProperties) || <p>There are no user-defined properties to display</p>;
        const replayDestination = this.props.endpointType === EndpointTypes.QUEUE ? this.props.endpointName : this.props.endpointParent;
        return (

            <div className="static-modal" >
                <Modal show={this.props.show} onHide={this.props.handleClose} className={modalStyle} id="messageBoxModal" >
                    <Modal.Header>
                        <Modal.Title className={headerStyle}>Message Id:&nbsp;</Modal.Title>
                        <Modal.Title className={messageIdStyle}>{message.predefinedProperties.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className={panelStyle} id="messageBoxModalBody">
                        <CollapsiblePanel panelTitle={"Pre-defined Properties"}>
                            <pre>{preDefinedPropsJSX}</pre>
                        </CollapsiblePanel>
                        <CollapsiblePanel panelTitle={"User-defined Properties"}>
                            <pre>{customPropsJSX}</pre>
                        </CollapsiblePanel>
                        <FormattingBox message={message.messageBody} />
                    </Modal.Body>

                    <Modal.Footer>
                        <ButtonToolbar className={buttonToolbarStyle}>
                            { /*Note that these buttons are rendered in order, Right-to-Left*/}
                            <Button onClick={this.props.handleClose} id="messageBoxClose">Close</Button>
                            <CopyTextButton text={message.messageBody} id="messageBoxCopy" />
                            <DeleteSingleMessageButton
                                uniqueId={message.uniqueId}
                                messageId={message.predefinedProperties.messageId}
                                endpointType={this.props.endpointType}
                                messageType={this.props.messageType}
                                parentName={this.props.endpointParent}
                                endpointName={this.props.endpointName}
                                closeParentModal={this.closeMessageModalAndReloadMessageTable}
                            />
                            <Button onClick={() => this.handleReplayMessage(message)} id="messageBoxReplayMessage" >{"Replay Message to " + replayDestination}</ Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}