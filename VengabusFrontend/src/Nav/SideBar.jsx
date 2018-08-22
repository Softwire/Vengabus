import React, { Component } from 'react';
import { ConnectionStringConfigForm } from '../Components/SideBar/ConnectionStringConfigForm';
import { css } from 'react-emotion';
import { grey } from '../colourScheme';
import { sharedSizesAndDimensions } from '../Helpers/SharedSizesAndDimensions';

export class SideBar extends Component {
    render() {
        //Navbar is 50px height, sidebar height must fit below that, therefore 100% of viewport height - 50px
        const backDiv = css`
            width: ${sharedSizesAndDimensions.SIDEBAR_WIDTH}px;
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
