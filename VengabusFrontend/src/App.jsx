import React, { Component } from 'react';
import { ReactHeader } from './ReactHeader/ReactHeader';
import { BootstrapCssLinks } from './Setup/BootstrapCssLinks';
import { VengabusNavBar } from './Nav/VengabusNavBar';
import { SideBar } from './Nav/SideBar';
import { CurrentPage } from './Pages/CurrentPage';

class App extends Component {
    render() {
        return (
            <div className="App">
                {/* Include the Bootstrap CSS at the top of the page. */}

                <BootstrapCssLinks />
                <ReactHeader />
                <VengabusNavBar />
                <div>
                    <SideBar />
                    <CurrentPage />
                </div>
            </div>
        );
    }
}

export default App;
