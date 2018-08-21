import React, { Component } from 'react';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { CopyTextButton } from '../CopyTextButton';
import { css } from 'emotion';
import { CollapsiblePanel } from '../CollapsiblePanel';
import { PAGES, pageSwitcher } from '../../Pages/PageSwitcherService';
import { FormattingBox } from './FormattingBox';

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
        //qq change hardcoded recipientIsQueue and selectedQueue later
        pageSwitcher.switchToPage(
            PAGES.SendMessagePage,
            { message: message, recipientIsQueue: true, selectedQueue: 'demoqueue1' }
        );
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
        const preDefinedPropsJSX = this.convertMessagePropertiesToJSXArray(message.predefinedProperties) || <p>There are no pre-defined properties to display</p>;
        const customPropsJSX = this.convertMessagePropertiesToJSXArray(message.customProperties) || <p>There are no user-defined properties to display</p>;
        return (
            <div className="static-modal" >
                <Modal show={this.props.show} onHide={this.props.handleClose} id="messageBoxModal" >
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
                        <FormattingBox message={this.props.message.messageBody} />
                    </Modal.Body>

                    <Modal.Footer>
                        <ButtonToolbar className={buttonToolbarStyle}>
                            { /*Note that these buttons are rendered in order, Right-to-Left*/}
                            <Button onClick={this.props.handleClose} id="messageBoxClose">Close</Button>
                            <CopyTextButton text={message.messageBody} id="messageBoxCopy" />
                            <Button onClick={() => this.handleReplayMessage(message)} id="messageBoxReplayMessage">Replay Message to demoqueue1</ Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}