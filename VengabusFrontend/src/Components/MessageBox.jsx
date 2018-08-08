import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormattingBox } from './FormattingBox';
import { CopyTextButton } from './CopyTextButton';
import { css } from 'emotion';
import { CollapsiblePanel } from './CollapsiblePanel';

export class MessageBox extends Component {

    getJSXFromProperties = (propertiesArray) => {
        let propertiesJSX = [];
        for (let propName in propertiesArray) {
            let currentPropValue = propertiesArray[propName];
            if (propName !== 'messageId' && currentPropValue !== null) {
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
        const message = this.props.message;
        if (!message) {
            return null;
        }
        const preDefinedPropsJSX = this.getJSXFromProperties(message.predefinedProperties) || <p>There are no pre-defined properties to display</p>;
        const customPropsJSX = this.getJSXFromProperties(message.customProperties) || <p>There are no user-defined properties to display</p>;
        return (
            <div className="static-modal" >
                <Modal show={this.props.show} onHide={this.props.handleClose} >
                    <Modal.Header>
                        <Modal.Title className={headerStyle}>Message Id:&nbsp;</Modal.Title>
                        <Modal.Title className={messageIdStyle}>{message.predefinedProperties.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <CollapsiblePanel panelTitle={"Pre-defined Properties"} panelContent={<pre>{preDefinedPropsJSX}</pre>}  />
                        <CollapsiblePanel panelTitle={"User-defined Properties"} panelContent={<pre>{customPropsJSX}</pre>} />
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