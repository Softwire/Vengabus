import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
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

    parseString = (data) => {
        this.setState({
            info: {
                NameSpaceName: 'name1',
                Status: 'on',
                Location: 'uk',
                permisson: 'all'
            }
        });
    };

    getData = () => {
        //this.setState({ info: this.state.value });
        this.parseString(this.state.value);
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
            background:${blue};
        `;
        return (
            <form>
                <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                    <ControlLabel>ServiceBus Connection String</ControlLabel>
                    <FormControl type="text" value={this.state.value} placeholder="Enter Connection String" onChange={this.handleChange} />
                    <FormControl.Feedback />
                </FormGroup>
                <Button className={buttonStyle} onClick={this.getData}>
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
                        <div>{`Permissions: ${this.state.info.permisson || ' '}`}</div>
                    </Panel.Body>
                </Panel>
            </form>
        );
        /*return (
            <div className="sb-config-form">
                <form>
                    Connection String:
                    <input
                        className={inputStyle}
                        type="text"
                        name="connectionString"
                        value={this.state.connectionString}
                        onChange={this.updateFormAndConnection_ConString}
                    />
                </form>
                <p>Fields currently held in form: {this.state.connectionString}</p>
                <button className={inputStyle} onClick={this.getData}>
                    Send Request
                </button>
            </div>
        );*/
    }
}
