import React, { Component } from 'react';
import { CrudInterface } from '../Components/Crud/CrudInterface';

export class CrudPage extends Component {

    render() {
        return (
            <CrudInterface {...this.props} />
        );
    }
}
