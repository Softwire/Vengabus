import React, { Component } from 'react';
import { BootstrapCssLinks } from './Setup/BootstrapCssLinks';
import { VengabusNavBar } from './Nav/VengabusNavBar';
import { SideBar } from './Nav/SideBar';
import { CurrentPage } from './Pages/CurrentPage';
import { sharedSizesAndDimensions } from './Helpers/SharedSizesAndDimensions';
import { css } from 'emotion';
import { Konamibus } from './Components/Konamibus';
import classNames from 'classnames';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class App extends Component {
    componentDidCatch(error, info) {
        NotificationManager.error(error, "Global Page error:", 99999, undefined, true);
    }

    render() {
        const appStyle = css`
            text-align: left;
        `;
        const mainPageStyle = css`
            margin-top: ${sharedSizesAndDimensions.DEFAULT_HEADER_HEIGHT}px;
        `;
        const contentStyle = css`
            margin-left: ${sharedSizesAndDimensions.SIDEBAR_WIDTH}px;
        `;
        const appClassNames = classNames('App', appStyle);
        return (
            <React.Fragment>
                <div className={appClassNames}>
                    {/* Include the Bootstrap CSS at the top of the page. */}
                    <BootstrapCssLinks />
                    <NotificationContainer />
                    <VengabusNavBar />
                    <div className={mainPageStyle}>
                        <Konamibus />
                        <SideBar />
                        <div className={contentStyle}>
                            <CurrentPage />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
