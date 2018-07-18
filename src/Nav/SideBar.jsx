import React, { Component } from 'react';

import { ConnectionStringConfigForm } from '../Components/ConnectionStringConfigForm';

import { css } from 'react-emotion';
import { grey, blue } from '../colourScheme';



export class SideBar extends Component {
    render() {
        const backDiv = css`
            width: 15%;
            height: 1080px;
            color: white;
            background: ${grey};
            float: left;
        `;
       

        return (
            <div className={backDiv}>
                    <ConnectionStringConfigForm />
            </div>
        );
    }
}
