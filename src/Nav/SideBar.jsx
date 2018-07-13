import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { css } from 'react-emotion';
import { Panel } from 'react-bootstrap';
import { ConnectionStringConfigForm } from '../Components/ConnectionStringConfigForm';
import { ServiceBusInfoBox } from '../Components/ServiceBusInfoBox';

export class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: 'rtsetsetsetsetsetset'
        };
    }

    render() {
        const backdiv = css`
            width: 15%;
            height: 1080px;
            color: white;
            background: black;
            float: left;
        `;
        const formdiv = css`
            color: white;
            padding: 5px;
        `;

        return (
            <div className={backdiv}>
                <div className={formdiv}>
                    <ConnectionStringConfigForm />
                    
                </div>
            </div>
        );
    }
}
