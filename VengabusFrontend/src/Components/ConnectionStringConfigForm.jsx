import React, { Component } from "react";
import { ServiceBusInfoBox } from "./ServiceBusInfoBox";
import { VengaServiceBusService } from "../AzureWrappers/VengaServiceBusService";
import { serviceBusConnection } from "../AzureWrappers/ServiceBusConnection";
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    Panel
} from "react-bootstrap";
import { css } from "react-emotion";
import { blue } from "../colourScheme";

export const LOCAL_STORAGE_STRINGS = Object.freeze({
    ConnectionString: "connectionString",
    APIroot: "apiRoot"
});

/**
 *    Local Storage is accessible as a global window when run in the browser.
 *    This variable exists mostly to be a holder for this comment! The global
 *    variable will be stubbed in by the jest-localstorage-mock package, during testing.
 */
const localStorageAccessor = localStorage;

export class ConnectionStringConfigForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            connStringVal: "",
            APIroot: "",
            info: ""
        };
    }

    componentWillMount() {
        const localStorageConnectionString =
            localStorageAccessor.getItem(LOCAL_STORAGE_STRINGS.ConnectionString) ||
            "";
        this.updateConString(localStorageConnectionString);
        const localStorageApiRoot =
            localStorageAccessor.getItem(LOCAL_STORAGE_STRINGS.APIroot) ||
            "";
        this.updateAPIroot(localStorageApiRoot);
    }

    /** Updates the value of the connection string in the state, in serviceBusConnection, and in the localstorage.  
     * @param {string} newConString The updated value of the connection string.  
     */
    updateConString = newConString => {
        this.setState({ connStringVal: newConString });
        serviceBusConnection.setConnectionString(newConString);
        localStorageAccessor.setItem(
            LOCAL_STORAGE_STRINGS.ConnectionString,
            newConString
        );
    };

    /** Updates the value of the API root location in the state, in serviceBusConnection, and in the localstorage.  
     * @param {string} newURI The updated value of the API root.  
     */
    updateAPIroot = newURI => {
        Math.random();
        this.setState({ APIroot: newURI });
        serviceBusConnection.setAPIroot(newURI);
        localStorageAccessor.setItem(
            LOCAL_STORAGE_STRINGS.APIroot,
            newURI
        );
    }

    // Called whenever the value of the connection string input box changes.
    handleConnectionChange = event => {
        this.updateConString(event.target.value);
    };

    // Called whenever the value of the API server input box changes.
    handleAPIChange = event => {
        this.updateAPIroot(event.target.value);
    }

    /**
     * Updates the info in the sidebar based on the current status of VengaServiceBusService.
     * Called whenver the connect button is pressed.
     */
    submitConnectionStringClick = () => {
        const infoPromise = VengaServiceBusService.getServiceBusProperties(
            this.state.connStringVal
        );
        infoPromise
            .then(response => {
                this.setState({
                    info: response
                });
            })
            .catch(error => {
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
                <FormGroup>
                    <ControlLabel>ServiceBus Connection String</ControlLabel>
                    <FormControl
                        id="connectionString"
                        type="text"
                        value={this.state.connStringVal}
                        placeholder="Enter Connection String"
                        onChange={this.handleConnectionChange}
                    />
                    <FormControl.Feedback />

                    <ControlLabel>ServiceBus API Server String</ControlLabel>
                    <FormControl
                        id="APILocationForm"
                        type="text"
                        value={this.state.APIroot}
                        placeholder="Enter API Server Location"
                        onChange={this.handleAPIChange}
                    />
                    <FormControl.Feedback />

                </FormGroup>
                <Button
                    className={buttonStyle}
                    onClick={this.submitConnectionStringClick}
                >
                    Connect
                </Button>
                {
                    //buttons want to grip on to the top of things not pretty so add a break to separate
                }
                <div>
                    <br />
                </div>
                <ServiceBusInfoBox
                    connStringVal={this.state.connStringVal}
                    info={this.state.info}
                />
            </form>
        );
    }
}
