import React, { Component } from 'react';

export class ExampleServiceBusDataDisplay extends Component {
    render() {
        return <p> I got back: '{JSON.stringify(this.props.data)}' </p>;
    }
}
