import React, { Component } from 'react';
import { BootstrapCssLinks } from './Setup/BootstrapCssLinks';
import { VengabusNavBar } from './Nav/VengabusNavBar';
import { SideBar } from './Nav/SideBar';
import { CurrentPage } from './Pages/CurrentPage';
import { sharedSizesAndDimensions } from './Helpers/SharedSizesAndDimensions';
import { css } from 'emotion';
import { Konamibus } from './Components/Konamibus';
import classNames from 'classnames';

class App extends Component {
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
            <div className={appClassNames}>
                {/* Include the Bootstrap CSS at the top of the page. */}
                <BootstrapCssLinks />
                <VengabusNavBar />
                <div className={mainPageStyle}>
                    <Konamibus />
                    <SideBar />
                    <div className={contentStyle}>
                        <CurrentPage />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
