import React from 'react';
import { Button, Overlay, Tooltip } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { css } from 'emotion';

/**
 * Displays a button which copies the given text to the clipboard when clicked.
 * @prop {string} text The text to copy.
 */
export class CopyTextButton extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.text = props.text;

        this.state = {
            show: false
        };
    }

    componentWillUnmount() {
        if (this.hideCopiedTooltip) {
            clearTimeout(this.hideCopiedTooltip);
        }
    }

    /**
     * Returns the component which the tooltip is pointing to.
     * @return {object} The component.
     */
    getTarget = () => {
        return ReactDOM.findDOMNode(this.target);
    }

    /**
     * Shows a 'copied' tooltip when the button is pressed.
     */
    handleToggle = () => {
        this.setState({ show: true });
        this.hideCopiedTooltip = setTimeout(() => {
            this.setState({ show: false });
        }, 2000);
    }

    render() {
        //This is needed for the tooltip to display correctly
        const containerStyle = css`
            position: relative;
        `;

        return (
            <CopyToClipboard text={this.text}>
                <div className={containerStyle}>
                    <Button
                        ref={button => {
                            this.target = button;
                        }}
                        onClick={this.handleToggle}
                    >
                        Copy Body
                    </Button>

                    <Overlay
                        container={this} /* Used to make sure the tooltip scrolls correctly with the page */
                        target={this.getTarget} /* The tooltip should appear above the copy button */
                        show={this.state.show} /* The tooltip should only be shown when this.state.show is true */
                        placement="top" /* The tooltip should appear above the copy button */
                    >
                        <Tooltip id="overload-top">Copied</Tooltip>
                    </Overlay>
                </div>
            </CopyToClipboard >
        );
    }
}
