import React, { Component } from 'react';
import { CrudInterface } from '../Components/CrudInterface';

export class CrudPage extends Component {

    render() {
        return (
            <CrudInterface {...this.props} />
        );
    }
}
