import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { PAGES, pageSwitcher } from './PageSwitcherService';
import { DemoPage } from './DemoPage';
import { HomePage } from './HomePage';
import { SendMessagePage } from './SendMessagePage';
import { CrudPage } from './CrudPage';

export class CurrentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: pageSwitcher.currentPage,
            pageData: pageSwitcher.pageData
        };
    }

    componentDidMount() {
        pageSwitcher.registerForSwitchUpdates(this.switchToPage);
    }

    componentWillUnmount() {
        pageSwitcher.deregisterForSwitchUpdates(this.switchToPage);
    }

    switchToPage = (page, pageData) => {
        this.setState({
            currentPage: page,
            pageData: pageData
        });
    };

    onChildInput = (e, targetProperty) => {
        const mutation = {};
        mutation[e.target.name] = e.target.value;
        this.setState(mutation);
    };

    render() {
        let returnValue;
        switch (this.state.currentPage) {
            case PAGES.HomePage:
                returnValue = <HomePage />;
                break;

            case PAGES.DemoPage:
                returnValue = <DemoPage />;
                break;
            case PAGES.SendMessagePage:
                returnValue =
                    <SendMessagePage
                        {...this.state.pageData}
                    />;
                break;
            case PAGES.CrudPage:
                returnValue =
                    <CrudPage
                        {...this.state.pageData}
                    />;
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
