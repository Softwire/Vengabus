import React, { Component } from 'react';
import logo from './ReactLogo.svg';
import './ReactHeader.css';

export class ReactHeader extends Component {
    render() {
        return (
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 color="blue" className="App-title">
                    Welcome to React
                </h1>
            </header>
        );
    }
}
