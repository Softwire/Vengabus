import React, { Component } from 'react';
import { css } from 'react-emotion';
import { ButtonWithConfirmationModal } from '../ButtonWithConfirmationModal';

/**
 * Send and Reset buttons for the send message page.
 * @prop {string} selectedEndpoint The name of the selected endpoint.
 * @prop {node} warnings A list of any warnings to present to the user when they try to submit the message
 * @prop {function} submit The function to be called when the Submit button is pressed.
 * @prop {function} discardMessage The function to be called when the Reset Fields button is pressed.
 */
export class MessageSendAndResetButtons extends Component {

    render() {

        const spacer = css`
            margin-bottom:10px;
        `;

        const buttonWidth = css`
            width:150px;
        `;

        return (

            <form>
                <ButtonWithConfirmationModal
                    class={buttonWidth}
                    id="submitButton"
                    buttonText={"Send Message"}
                    buttonStyle="default"
                    buttonDisabled={this.props.selectedEndpoint ? false : true}
                    modalTitle={"Send Message to " + this.props.selectedEndpoint}
                    modalBody={
                        <React.Fragment>
                            <p>{"Message will be sent to: " + this.props.selectedEndpoint}</p>
                            {this.props.warnings}
                            <p>{"Confirm sending message?"}</p>
                        </React.Fragment>
                    }
                    confirmButtonText={"Send"}
                    confirmAction={this.props.submit}
                />
                <div className={spacer} />
                <ButtonWithConfirmationModal
                    class={buttonWidth}
                    id="cancelButton"
                    buttonText={"Reset Fields"}
                    modalTitle={"Reset all fields"}
                    modalBody={
                        <React.Fragment>
                            <p>Are you sure you want to reset ALL fields of the current message?</p>
                            <p>Note: if you are replaying an existing message, resetting the fields here will have NO effect on the orignal message.</p>
                        </React.Fragment>
                    }
                    confirmButtonText={"Reset"}
                    confirmAction={this.props.discardMessage}
                />
            </form>
        );
    }

}