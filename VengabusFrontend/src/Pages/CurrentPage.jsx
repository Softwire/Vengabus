import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { PAGES, pageSwitcher } from './PageSwitcherService';
import { HomePage } from './HomePage';
import { OtherPage } from './OtherPage';
import { SendMessagePage } from './SendMessagePage';

export class CurrentPage extends Component {
    constructor(props) {
        super(props);
        this.messageToReplay = undefined;
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
        const mutation = {};
        mutation[e.target.name] = e.target.value;
        this.setState(mutation);
    };

    replayMessage = (message) => {
        this.messageToReplay = message;
        pageSwitcher.switchToPage(PAGES.SendMessagePage);
    }

    render() {
        let returnValue;
        switch (this.state.currentPage) {
            case PAGES.HomePage:
                returnValue = <HomePage replayMessage={this.replayMessage} />;
                break;

            case PAGES.OtherPage:
                returnValue = <OtherPage />;
                break;

            case PAGES.SendMessagePage:
                returnValue = <SendMessagePage message={this.messageToReplay ? { ...this.messageToReplay } : undefined} />;
                this.messageToReplay = undefined;
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
