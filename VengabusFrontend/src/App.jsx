import React, { Component } from 'react';
import { BootstrapCssLinks } from './Setup/BootstrapCssLinks';
import { VengabusNavBar } from './Nav/VengabusNavBar';
import { SideBar } from './Nav/SideBar';
import { CurrentPage } from './Pages/CurrentPage';

class App extends Component {
    render() {
        return (
            <div className="App" style={{ "text-align": "center" }}>
                {/* Include the Bootstrap CSS at the top of the page. */}
                <BootstrapCssLinks />
                <VengabusNavBar />
                <div style={{ "margin-top": "50px" }}>
                    <SideBar />
                    <CurrentPage />
                </div>
            </div>
        );
    }
}

export default App;
