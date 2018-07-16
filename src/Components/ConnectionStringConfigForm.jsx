import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { VengaServiceBusService } from '../AzureWrappers/VengaServiceBusService';
import { css } from 'react-emotion';
import { FormGroup, FormControl, ControlLabel, Button, Panel } from 'react-bootstrap';
import { blue } from '../colourScheme';
export class ConnectionStringConfigForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            info: ''
        };
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };

    submitConnectingStringClick = () => {
        const infoPromise = VengaServiceBusService.getConnectingStringMetaData(this.state.value);
        infoPromise.then( (object) =>{
            this.setState({
                info: {
                    NameSpaceName: object.name,
                    Status: object.status,
                    Location: object.location,
                    Permission: object.permission
                }
            });
        });
    };

    getValidationState = () => {};

    render() {
        const inputStyle = css`
            color: black;
        `;

        const infoBoxStyle = css`
            color: black;
            overflow-wrap: break-word;
        `;

        const buttonStyle = css`
            color: black;
            margin: 5px;
        `;
        const headerColour = css`
            background: ${blue};
        `;
        return (
            <form>
                <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                    <ControlLabel>ServiceBus Connection String</ControlLabel>
                    <FormControl type="text" value={this.state.value} placeholder="Enter Connection String" onChange={this.handleChange} />
                    <FormControl.Feedback />
                </FormGroup>
                <Button className={buttonStyle} onClick={this.submitConnectingStringClick}>
                    Submit
                </Button>
                <div>
                    {' '}
                    <p />
                </div>
                <Panel>
                    <Panel.Heading className={headerColour}>ServiceBus Details</Panel.Heading>
                    <Panel.Body className={infoBoxStyle}>
                        <div>{`Your connecting string: ${this.state.value || ' '}`}</div>
                        <div>{`Name: ${this.state.info.NameSpaceName || ' '}`}</div>
                        <div>{`Location: ${this.state.info.Location || ' '}`}</div>
                        <div>{`Status: ${this.state.info.Status || ' '}`}</div>
                        <div>{`Permissions: ${this.state.info.Permission || ' '}`}</div>
                    </Panel.Body>
                </Panel>
            </form>
        );
    }
}
