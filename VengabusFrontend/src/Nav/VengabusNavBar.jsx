import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
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
                        {/* Needed so that the Navigation items move into a menu when they cannot all fit on a small screen. */}
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
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </nav>
        );
    }
}
