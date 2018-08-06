
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormattingBox } from './FormattingBox';
import { CopyTextButton } from './CopyTextButton';
import { css } from 'emotion';
import { headerStyle, messageIdStyle } from './MessageBoxStyles';

export class MessageBox extends Component {

    render() {
        const buttonStyle = css`
            float: right;
            margin-left: 5px;
        `;
        const message = this.props.vengaMessageObject;
        if (!message) {
            return null;
        }
        const preDefinedProps = message.predefinedProperties;
        const customProps = message.customProperties;
        const preDefinedPropsJSX = [];
        const customPropsJSX = [];
        for (let propName in preDefinedProps) {
            let currentPropValue = preDefinedProps[propName];
            if (currentPropValue !== null) {
                preDefinedPropsJSX.push(
                    <div key={propName}>
                        <p>{propName + ': ' + String(currentPropValue)}</p> {/*string conversion needed to display booleans properly*/}
                    </div>
                );
            }
        }
        if (preDefinedPropsJSX === []) {
            preDefinedPropsJSX.push(<p>There are no pre-defined properties to display.</p>);
        }
        if (customProps) {
            for (let propName in customProps) {
                customPropsJSX.push(
                    <div key={propName}>
                        <p>{propName + ': ' + String(customProps[propName])}</p>
                    </div>
                );
            }
        } else {
            customPropsJSX.push(<p>There are no user-defined properties to display.</p>);
        }

        return (
            <div className="static-modal">
                <Modal show={this.props.show} onHide={this.props.handleClose} > {/*qq JF AW was previously this.props.show && this.props.show, not sure why */}
                    <Modal.Header>
                        <Modal.Title className={headerStyle}>Message Id:&nbsp;</Modal.Title>
                        <Modal.Title className={messageIdStyle}>{preDefinedProps.messageId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <h4 className={headerStyle}>Pre-defined Properties</h4>
                        {preDefinedPropsJSX}
                        <br />
                        <h4 className={headerStyle}>User-defined Properties</h4>
                        {customPropsJSX}
                        <br />
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