import React, { Component } from 'react';
import logo from './logo.jpg';
import './App.css';

const crypto = require('crypto');
const moment = require('moment');

let token_expiry;

function create_sas_token(uri, key_name, key) {
    // Token expires in one hour
    const expiry = moment().add(1, 'hours').unix();

    const string_to_sign = encodeURIComponent(uri) + '\n' + expiry;
    var hmac = crypto.createHmac('sha256', key);
    hmac.update(string_to_sign);
    const signature = hmac.digest('base64');
    token_expiry = expiry;
    const token = 'SharedAccessSignature sr=' + encodeURIComponent(uri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + key_name;

    return token;
}

function getTokenFromConnectionString(connectionString) {
    const connectionArray = connectionString.split(';');
    let endPoint = '', sharedAccessKeyName = '', sharedAccessKey = '';

    for (let i = 0; i < connectionArray.length; i++) {
        const EndpointLabel = 'Endpoint=sb://';
        const KeyNameLabel = 'SharedAccessKeyName=';
        const KeyLabel = 'SharedAccessKey=';
        const currentSection = connectionArray[i];

        if (currentSection.startsWith(EndpointLabel)) {
            endPoint = 'https://' + currentSection.slice(EndpointLabel.length);
        }
        if (currentSection.startsWith(KeyNameLabel)) {
            sharedAccessKeyName = currentSection.slice(KeyNameLabel.length);
        }
        if (currentSection.startsWith(KeyLabel)) {
            sharedAccessKey = currentSection.slice(KeyLabel.length);
        }
    }
    return create_sas_token(endPoint, sharedAccessKeyName, sharedAccessKey);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            connectionString: localStorage.getItem("KeyGenConnectionString") || "",
            connectionStringName: localStorage.getItem("KeyGenConnectionStringName") || ""
        };
    }
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
        this.setState({
            token: getTokenFromConnectionString(this.state.connectionString)
        });
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to Vengabus</h1>
                </header>
                <input
                    style={{ width: 400, height: 30 }}
                    placeholder="Enter connection string"
                    value={this.state.connectionString}
                    onChange={(event) => {
                        this.setState({
                            connectionString: event.target.value,
                            token: getTokenFromConnectionString(event.target.value)
                        });
                        localStorage.setItem("KeyGenConnectionString", event.target.value);
                    }}
                />
                <p><b>
                    This token is only valid for one hour ({token_expiry - moment().unix()} seconds until expiry). Refresh the page to get a new one if it has expired!
          </b></p >
                <p>
                    {this.state.token}
                </p>
            </div >
        );
    }
}

export default App;
