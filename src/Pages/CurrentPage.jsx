import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { PAGES, pageSwitcher } from './PageSwitcherService';
import { HomePage } from './HomePage';
import { OtherPage } from './OtherPage';

export class CurrentPage extends Component {
    constructor(props) {
        super(props);

        this.state = { currentPage: pageSwitcher.currentPage };
    }

    componentDidMount() {
        pageSwitcher.registerForSwitchUpdates(this.switchToPage);
    }

    componentWillUnmount() {
        pageSwitcher.deregisterForSwitchUpdates(this.switchToPage);
    }

    switchToPage = (page) => {
        this.setState({ currentPage: page });
    };

    onChildInput = (e, targetProperty) => {
        var mutation = {};
        mutation[e.target.name] = e.target.value;
        this.setState(mutation);
    };

    render() {
        //console.log('rendering current Page: ', this.state.currentPage);
        let returnValue;

        switch (this.state.currentPage) {
            case PAGES.HomePage:
                returnValue = <HomePage />;
                break;

            case PAGES.OtherPage:
                returnValue = <OtherPage />;
                break;

            default:
                returnValue = 
                    <Alert bsStyle="danger">
                        <p>Requested Unknown Page: {this.state.currentPage}</p>
                    </Alert>
                ;
        }
        return returnValue;
    }
}
