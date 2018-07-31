import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { PAGES, pageSwitcher } from './PageSwitcherService';
import { HomePage } from './HomePage';
import { DemoPage } from './DemoPage';
import { TwoListDisplayPage } from './TwoListDisplayPage';
import { SendMessagePage } from './SendMessagePage';

export class CurrentPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: pageSwitcher.currentPage,
            data: pageSwitcher.data
        };
    }

    componentDidMount() {
        pageSwitcher.registerForSwitchUpdates(this.switchToPage);
    }

    componentWillUnmount() {
        pageSwitcher.deregisterForSwitchUpdates(this.switchToPage);
    }

    switchToPage = (page, data) => {
        this.setState({
            currentPage: page,
            data: data
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
            case PAGES.QueueDispayPage:
                returnValue = <TwoListDisplayPage />;
                break;

            case PAGES.SendMessagePage:
                const messageTemplate = this.state.data;
                returnValue = <SendMessagePage data={messageTemplate ? { ...messageTemplate } : undefined} />;
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
