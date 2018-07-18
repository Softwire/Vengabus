import React, { Component } from 'react';
import { ServiceBusInfoBox } from './ServiceBusInfoBox';
import { VengaServiceBusService } from '../AzureWrappers/VengaServiceBusService';
import { css } from 'react-emotion';
import { FormGroup, FormControl, ControlLabel, Button, Panel } from 'react-bootstrap';
import { blue } from '../colourScheme';

export class ConnectionStringConfigForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connStringVal: '',
            info: ''
        };
    }

    handleChange = (event) => {
        this.setState({ connStringVal: event.target.value });
    };

    submitConnectionStringClick = () => {
        const infoPromise = VengaServiceBusService.getServiceBusProperties(this.state.connStringVal);
        infoPromise
            .then((response) => {
                this.setState({
                    info: response
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        const inputStyle = css`
            color: black;
        `;

        const buttonStyle = css`
            color: black;
            margin: 5px;
        `;

        const formStyle = css`
            padding: 5px;
        `;
        return (
            <form className={formStyle}>
                <FormGroup controlId="formBasicText">
                    <ControlLabel>ServiceBus Connection String</ControlLabel>
                    <FormControl type="text" value={this.state.connStringVal} placeholder="Enter Connection String" onChange={this.handleChange} />
                    <FormControl.Feedback />
                </FormGroup>
                <Button className={buttonStyle} onClick={this.submitConnectionStringClick}>
                    Connect
                </Button>
                {
                    //buttons want to grip on to the top of things not pretty so add a break to separate
                }
                <div>
                    <br />
                </div>
                <ServiceBusInfoBox connStringVal={this.state.connStringVal} info={this.state.info} />
            </form>
        );
    }
}
