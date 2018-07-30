import React, { Component } from 'react';
import { BootstrapCssLinks } from './Setup/BootstrapCssLinks';
import { VengabusNavBar } from './Nav/VengabusNavBar';
import { SideBar } from './Nav/SideBar';
import { CurrentPage } from './Pages/CurrentPage';
import { css } from 'emotion';

class App extends Component {
    render() {
        const appStyle = css`
            text-align: center;
        `;
        const mainPageStyle = css`
            margin-top: 50px;
        `;
        return (
            <div className={`App ${appStyle}`}>
                {/* Include the Bootstrap CSS at the top of the page. */}
                <BootstrapCssLinks />
                <VengabusNavBar />
                <div className={mainPageStyle}>
                    <SideBar />
                    <CurrentPage />
                </div>
            </div>
        );
    }
}

export default App;
