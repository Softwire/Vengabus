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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: create_sas_token("https://vengabusdemo.servicebus.windows.net/",
        "RootManageSharedAccessKey", "3fUrWMiu8O1ZViQDPYmHVqg8OUZ3muKT7G624jv4MdM=")
    };
  }
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
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
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p><b>
          This token is only valid for one hour ({token_expiry - moment().unix()} seconds until expiry). Refresh the page to get a new one if it has expired!
          </b></p>
        <p>
          {this.state.token}
        </p>
      </div>
    );
  }
}

export default App;
