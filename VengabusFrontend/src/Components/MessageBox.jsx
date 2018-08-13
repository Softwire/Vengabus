import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormattingBox } from './FormattingBox';
import { CopyTextButton } from './CopyTextButton';
import { css } from 'emotion';
import { CollapsiblePanel } from './CollapsiblePanel';

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

    render() {
        const buttonStyle = css`
            float: right;
            margin-left: 5px;
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
                <Modal show={this.props.show} onHide={this.props.handleClose} >
                    <Modal.Header>
                        <Modal.Title className={headerStyle}>Message Id:&nbsp;</Modal.Title>
                        <Modal.Title className={messageIdStyle}>{message.predefinedProperties.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className={panelStyle}>
                        <CollapsiblePanel panelTitle={"Pre-defined Properties"}>
                            <pre>{preDefinedPropsJSX}</pre>
                        </CollapsiblePanel>
                        <CollapsiblePanel panelTitle={"User-defined Properties"}>
                            <pre>{customPropsJSX}</pre>
                        </CollapsiblePanel>
                        <FormattingBox
                            data={message.messageBody}
                        />
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className={buttonStyle} onClick={this.props.handleClose}>Close</Button>
                        <CopyTextButton className={buttonStyle} text={this.props.messageBody} />
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}