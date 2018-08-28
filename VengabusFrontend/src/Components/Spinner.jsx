import React from 'react';
import { css } from 'emotion';
import { panelDarkGrey } from '../colourScheme';
import { PacmanLoader } from 'react-spinners';

class Spinner extends React.Component {
    render() {

        const centralSpinner = css`
            float: none;
            margin: 10px auto 20px auto;
        `;

        return <PacmanLoader
            className={this.props.className ? this.props.className : centralSpinner}
            sizeUnit={"px"}
            size={this.props.size}
            color={this.props.color ? this.props.color : panelDarkGrey}
        />;
    }
}

export { Spinner };