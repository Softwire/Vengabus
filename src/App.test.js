import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BootstrapCssLinks } from './BootstrapCssLinks';
import { CurrentPage } from './CurrentPage';
import { PAGES, pageSwitcher } from './PageSwitcherService';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing1', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CurrentPage />, div);
    console.log(div.innerHTML);
    pageSwitcher.switchToPage(PAGES.OtherPage);
    console.log(div.innerHTML);
    ReactDOM.unmountComponentAtNode(div);
});

it('renders without crashing2', () => {
    const div = document.createElement('div');
    ReactDOM.render(<BootstrapCssLinks />, div);
    ReactDOM.unmountComponentAtNode(div);
});
