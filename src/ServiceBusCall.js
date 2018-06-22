import React, { Component } from 'react';

export default class ServiceBusCall extends Component {

    constructor(props){
        super(props);

        this.config = props.serviceBusConfig;
        this.state = { resultText: "I haven't done it yet."};

        var delayedPromise = new Promise(function(resolve, reject) {
            setTimeout(resolve, 3000, undefined/*Arg of resolve, passed to then*/);
        });
        delayedPromise.then((/*Arg of resolve, passed to then*/) => {
            this.setState({resultText: `ConnString = ${this.props.serviceBusConfig.connectionString}. Name = ${this.props.serviceBusConfig.queueName}`})
        });
    }

    render() {
        return (<p> I returned:'{this.state.resultText}' </p>);
    }
}