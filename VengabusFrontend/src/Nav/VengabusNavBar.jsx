import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { PAGES, pageSwitcher } from '../Pages/PageSwitcherService';

export class VengabusNavBar extends Component {
    onNavSelect = (eventKey) => {
        pageSwitcher.switchToPage(eventKey);
    };

    render() {
        return (
            <nav>
                <Navbar inverse collapseOnSelect fixedTop onSelect={this.onNavSelect}>
                    <Navbar.Header>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem id="navbarHomePageButton" eventKey={PAGES.HomePage} >
                                Home
                            </NavItem>
                            <NavItem id="navbarSendMessagePageButton" eventKey={PAGES.SendMessagePage} >
                                Send Message
                            </NavItem>
                            <NavItem id="navbarDemoPageButton" eventKey={PAGES.DemoPage} >
                                DemoPage
                            </NavItem>
                            <NavItem id="navbarEditWueuesPageButton" eventKey={PAGES.EditQueuesPage} >
                                Edit Queues
                            </NavItem>
                            <NavDropdown eventKey={'UnknownPage'} title="Dropdown" id="basic-nav-dropdown">
                                <MenuItem eventKey={'UnknownPage1'} >
                                    Action
                                </MenuItem>
                                <MenuItem eventKey={'UnknownPage2'}>Another action</MenuItem>
                                <MenuItem eventKey={'UnknownPage3'}>Something else here</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey={'UnknownPage4'}>Separated link</MenuItem>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </nav>
        );
    }
}
