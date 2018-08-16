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
import CreatableSelect from "react-select/lib/Creatable";

export const LOCAL_STORAGE_STRINGS = Object.freeze({
    ConnectionStrings: "connectionStrings",
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
            activeConnectionString: { label: "", value: "" },
            connectedTo: { label: "", value: "" },
            APIroot: "",
            info: ""
        };
    }

    componentDidMount() {
        //local storage only supports strings. So we have to get the string first, then use JSON.parse
        //to recover the original list (array).
        let connectionStringListStringified =
            localStorageAccessor.getItem(LOCAL_STORAGE_STRINGS.ConnectionStrings) ||
            "";
        let connectionStringList;
        try {
            connectionStringList = JSON.parse(connectionStringListStringified);
        } catch (e) {
            connectionStringList = [];
        }

        //maybe for some reason it's not an array, we'll fix it here so that the code doesn't crash later
        if (!Array.isArray(connectionStringList)) {
            connectionStringList = [];
        }

        //for backward compatibility -- to be removed in the future
        if (connectionStringList.length === 0) {
            let connectionString = localStorageAccessor.getItem("connectionString");
            if (connectionString) {
                connectionStringList = [{ value: connectionString, label: "Old Connection String" }];
                localStorageAccessor.setItem(LOCAL_STORAGE_STRINGS.ConnectionStrings, JSON.stringify(connectionStringList));
                localStorageAccessor.setItem("connectionString", "");
            }
        }
        this.populateConnectionStringList(connectionStringList);

        const localStorageApiRoot =
            localStorageAccessor.getItem(LOCAL_STORAGE_STRINGS.APIroot) ||
            "";
        this.populateAPIRoot(localStorageApiRoot);
    }

    /** Populates the connection string list on page.
     * @param {string[]} newConnectionStringList The list to be populated.
     */
    populateConnectionStringList = newConnectionStringList => {
        this.setState({ connectionStringList: newConnectionStringList });
        if (newConnectionStringList.length) {
            //if we have some in local storage, use the most recently used one
            this.setState({ activeConnectionString: newConnectionStringList[0] });
        }
    }

    /** Populates the apiRoot on page.
     * @param {string} newApiRoot The apiRoot to be populated.  
     */
    populateAPIRoot = newApiRoot => {
        serviceBusConnection.setApiRoot(newApiRoot);
        this.setState({ APIroot: newApiRoot });
    }

    updateConnectionStringLocalStorage = (connectionStrings) => {
        localStorageAccessor.setItem(
            LOCAL_STORAGE_STRINGS.ConnectionStrings,
            JSON.stringify(connectionStrings)
        );
    }

    /** Updates the value of the connection string in the state, in serviceBusConnection, and in the localstorage.  
     * @param {object} newConnection The updated value of the connection.  
     */
    updateConnectionStringList = (connectionString) => {

        //put the most recently used string to the top
        let connectionStringList = this.state.connectionStringList;
        for (let i = 0; i < connectionStringList.length; i++) {
            if (connectionStringList[i].label === connectionString.label) {
                connectionStringList.splice(i, 1);
            }
        }
        connectionStringList.splice(0, 0, connectionString);

        this.setState({
            activeConnectionString: connectionString,
            connectionStringList: connectionStringList
        });

        //local storage only supports strings, so stringify our list and save in local storage
        this.updateConnectionStringLocalStorage(connectionStringList);
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

    deleteConnection = () => {
        //nothing to delete
        if (!this.state.connectionStringList || !this.state.connectionStringList.length) {
            return;
        }
        if (!this.state.activeConnectionString || this.state.activeConnectionString.label === "") {
            return;
        }
        let newConnectionStringList = this.state.connectionStringList;
        let index = newConnectionStringList.find((element) => { return this.state.activeConnectionString.label === element.label });
        if (index === -1) {//this should never happen. But if it does occur, we don't want the page to crash
            return;
        }
        newConnectionStringList.splice(index, 1);
        let activeConnectionString;

        //use the most commonly used string, if we still have strings left. But don't connect to it -- that's for users to decide
        if (newConnectionStringList.length) {
            activeConnectionString = newConnectionStringList[0];
        } else {
            activeConnectionString = { value: "", label: "" };
        }
        this.setState({
            connectionStringList: newConnectionStringList,
            activeConnectionString: activeConnectionString,
            info: "",
            connectedTo: { value: "", label: "" }
        });

        //clear it from servicebusConnection. Or shall we rather keep it?
        serviceBusConnection.setConnectionString("");

        //update local storage
        this.updateConnectionStringLocalStorage(newConnectionStringList);
    }

    // Called whenever the value of the connection string input box changes.
    handleConnectionChange = event => {
        let newConnectionString = { ...this.state.activeConnectionString };
        newConnectionString.value = event.target.value;
        this.setState({ activeConnectionString: newConnectionString });
    };

    // Called whenever the value of the connection string label select box changes (or when a new one is created).
    handleConnectionStringLabelChange = event => {
        //react-select has a different onChange event structure.
        //The new value is directly in event, instead of event.target.*
        if (!event.label || !event.value) {
            return;
        }

        let newConnectionStringList = this.state.connectionStringList;
        //The onCreate event doesn't seem to work as expected, but when a new entry is created, the value and label are identical.
        //So we can use that to identify when the user creates a new string.
        if (event.value === event.label) {
            event.value = '';
            newConnectionStringList.splice(0, 0, event);
        }
        this.setState({
            activeConnectionString: event,
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

        //only save new strings when they are actually used.
        let activeConnectionString = this.state.activeConnectionString;

        //set servicebus to use new connection string
        serviceBusConnection.setConnectionString(activeConnectionString.value);

        //update string list by most recently used, and then update local storage
        this.updateConnectionStringList(activeConnectionString);
        this.updateAPIrootStorage(this.state.APIroot);

        serviceBusConnection.promptUpdate();

        infoPromise
            .then(response => {
                this.setState({
                    info: response,
                    //only update this when we actually connect to something.
                    connectedTo: activeConnectionString
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

        const selectStyle = css`
            padding: 5px;
            color: black;
        `;

        return (
            <form className={formStyle}>
                <FormGroup controlId="connectionStringLabel">
                    <ControlLabel>Select Existing/Create New String</ControlLabel>
                    <CreatableSelect className={selectStyle}
                        value={this.state.activeConnectionString}
                        placeholder="Select a connection string"
                        onChange={this.handleConnectionStringLabelChange}
                        options={this.state.connectionStringList}
                    />
                </FormGroup>

                <FormGroup controlId="connectionString">
                    <ControlLabel>Connection String</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.activeConnectionString.value}
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
                <Button
                    className={buttonStyle}
                    onClick={this.deleteConnection}
                    id="deleteConnectionButton"
                    bsStyle="danger"
                >
                    Delete Connection
                </Button>
                {
                    //buttons want to grip on to the top of things not pretty so add a break to separate
                }
                <div>
                    <br />
                </div>
                <ServiceBusInfoBox
                    connectionString={this.state.connectedTo}
                />
            </form>
        );
    }
}
