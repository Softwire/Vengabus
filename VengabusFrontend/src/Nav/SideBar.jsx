import React, { Component } from 'react';

import { ConnectionStringConfigForm } from '../Components/ConnectionStringConfigForm';

import { css } from 'react-emotion';
import { grey } from '../colourScheme';



export class SideBar extends Component {
    render() {
        //Navbar is 50px height, sidebar height must fit below that, therefore 100% of viewport height - 50px
        const backDiv = css`
            width: 15%;
            min-height: calc(100vh - 50px);
            position: fixed;
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
