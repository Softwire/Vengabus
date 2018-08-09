import React, { Component } from "react";
import { ServiceBusInfoBox } from "./ServiceBusInfoBox";
import { serviceBusConnection } from "../../AzureWrappers/ServiceBusConnection";
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from "react-bootstrap";
import { css } from "react-emotion";
import { Creatable } from "react-select";

export const LOCAL_STORAGE_STRINGS = Object.freeze({
    ConnectionStringList: "connectionStringList",
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
            connectionStringList: [],
            connectionString: { label: "", value: "" },
            APIroot: ""
        };
    }

    componentDidMount() {
        //local storage only supports strings. So we have to get the string first, then use JSON.parse
        //to recover the original list (array).
        let connectionStringListStringified =
            localStorageAccessor.getItem(LOCAL_STORAGE_STRINGS.ConnectionStringList) ||
            "";
        let connectionStringList;
        try {
            connectionStringList = JSON.parse(connectionStringListStringified);
        } catch (e) {
            connectionStringList = [];
        }

        if (!Array.isArray(connectionStringList)) {
            connectionStringList = [];
        }
        //for backward compatibility -- to be removed in the future
        if (connectionStringList.length === 0) {
            let connectionString = localStorageAccessor.getItem("connectionString");
            if (connectionString) {
                connectionStringList = [{ value: connectionString, label: "Old Connection String" }];
            }
        }
        this.populateConnectionStringList(connectionStringList);

        const localStorageApiRoot =
            localStorageAccessor.getItem(LOCAL_STORAGE_STRINGS.APIroot) ||
            "";
        this.populateAPIRoot(localStorageApiRoot);
    }

    populateConnectionStringList = newConnectionStringList => {
        this.setState({ connectionStringList: newConnectionStringList });
        if (newConnectionStringList.length > 0) {
            this.setState({
                connectionString: newConnectionStringList[0]
            });
        }
    }

    populateAPIRoot = newApiRoot => {
        this.setState({ APIroot: newApiRoot });
    }

    /** Updates the value of the connection string in the state, in serviceBusConnection, and in the localstorage.  
     * @param {object} newConnection The updated value of the connection.  
     */
    updateConnectionStringStorage = (connectionString) => {

        let connectionStringList = this.state.connectionStringList;
        for (let i = 0; i < connectionStringList.length; i++) {
            if (connectionStringList[i].label === connectionString.label) {
                connectionStringList.splice(i, 1);
            }
        }
        connectionStringList.splice(0, 0, connectionString);

        this.setState({
            connectionString: connectionString
        });
        console.log(connectionString);
        console.log(connectionStringList);

        serviceBusConnection.setConnectionString(connectionString.value);
        localStorageAccessor.setItem(
            LOCAL_STORAGE_STRINGS.ConnectionStringList,
            JSON.stringify(connectionStringList)
        );
    };

    /** Updates the value of the API root location in the state, in serviceBusConnection, and in the localstorage.  
     * @param {string} newURI The updated value of the API root.  
     */
    updateAPIrootStorage = newURI => {
        this.setState({ APIroot: newURI });
        serviceBusConnection.setApiRoot(newURI);
        localStorageAccessor.setItem(
            LOCAL_STORAGE_STRINGS.APIroot,
            newURI
        );
    }

    // Called whenever the value of the connection string input box changes.
    handleConnectionChange = event => {
        let newConnectionString = this.state.connectionString;
        newConnectionString.value = event.target.value;
        this.setState({ connectionString: newConnectionString });
    };

    // Called whenever the value of the connection string label select box changes (or when a new one is created).
    handleConnectionStringLabelChange = event => {
        //a new connection string
        let newConnectionStringList = this.state.connectionStringList;
        if (event.value === event.label) {
            event.value = '';
            newConnectionStringList.splice(0, 0, event);
        }
        this.setState({
            connectionString: event,
            connectionStringList: newConnectionStringList
        });
    }

    // Called whenever the value of the API server input box changes.
    handleAPIChange = event => {
        this.setState({ APIroot: event.target.value });
    }

    /**
     * Updates the info in the sidebar based on the current status of VengaServiceBusService,
     * and save data in local storage.
     * Called whenver the connect button is pressed.
     */
    submitConnectionStringClick = () => {

        this.updateConnectionStringStorage(this.state.connectionString);
        this.updateAPIrootStorage(this.state.APIroot);

        serviceBusConnection.promptUpdate();

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

        const buttonStyle = css`
            color: black;
            margin: 5px;
        `;

        const formStyle = css`
            padding: 5px;
        `;

        return (
            <form className={formStyle}>
                <FormGroup controlId="connectionStringLabel">
                    <ControlLabel>Connection String Label</ControlLabel>
                    <Creatable
                        value={this.state.connectionString}
                        placeholder="Select a connection string"
                        onChange={this.handleConnectionStringLabelChange}
                        options={this.state.connectionStringList}
                    />
                </FormGroup>

                <FormGroup controlId="connectionString">
                    <ControlLabel>Connection String</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.connectionString.value}
                        placeholder="Connection String"
                        onChange={this.handleConnectionChange}
                    />
                </FormGroup>

                <FormGroup controlId="APILocationForm">
                    <ControlLabel>ServiceBus API Server String</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.APIroot}
                        placeholder="API Location, e.g. http://a.com:63591/"
                        onChange={this.handleAPIChange}
                    />
                </FormGroup>
                <Button
                    className={buttonStyle}
                    onClick={this.submitConnectionStringClick}
                    id="connectButton"
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
                    connectionStringValue={this.state.connectionStringValue}
                />
            </form>
        );
    }
}
