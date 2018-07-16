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

    submitConnectionStringClick = () => {
        const infoPromise = VengaServiceBusService.getConnectionStringMetaData(this.state.value);
        infoPromise
            .then((response) => {
                this.setState({
                    info: {
                        NameSpaceName: response.name,
                        Status: response.status,
                        Location: response.location,
                        Permission: response.permission
                    }
                });
            })
            .catch((error) => {
                console.log(error);
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
                <Button className={buttonStyle} onClick={this.submitConnectionStringClick}>
                    Submit
                </Button>
                <div>
                    {' '}
                    <p />
                </div>
                <Panel>
                    <Panel.Heading className={headerColour}>ServiceBus Details</Panel.Heading>
                    <Panel.Body className={infoBoxStyle}>
                        <div>{`Your Connection string: ${this.state.value || ' '}`}</div>
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
