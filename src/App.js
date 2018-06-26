import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ServiceBusConfigForm from './ServiceBusConfigForm';
import ServiceBusCall from './ServiceBusCall';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
        connectionString: "",
        queueName: ""
    };
  }

  onChildInput = (e, targetProperty) => {
    var mutation = {};
    mutation[e.target.name] = e.target.value;
    this.setState(mutation)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 color="blue" className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ServiceBusConfigForm parentState={this.state} onChangeCallback={this.onChildInput} />
        <ServiceBusCall serviceBusConfig={this.state} />
      </div>
    );
  }
}

export default App;
