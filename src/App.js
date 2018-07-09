import React, { Component } from 'react';
import { ReactHeader } from './ReactHeader/ReactHeader';
import { BootstrapCssLinks } from './BootstrapCssLinks';
import { VengabusNavBar } from './Nav/VengabusNavBar';
import { CurrentPage } from './Pages/CurrentPage';

class App extends Component {
    render() {
        return (
            <div className="App">
                {/* Include the Bootstrap CSS at the top of the page. */}
                <BootstrapCssLinks />
                <ReactHeader />
                <VengabusNavBar />
                <div className="sideBar">Some Global "Side" Bar</div>
                <CurrentPage />
            </div>
        );
    }
}

export default App;
