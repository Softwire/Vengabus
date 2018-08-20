import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { palerBlue } from '../../colourScheme';
import { Button } from 'react-bootstrap';
import { pageSwitcher, PAGES } from '../Pages/PageSwitcherService';
import { EndpointTypes } from '../Helpers/EndpointTypes';


export class TopicList extends Component {

    render() {

        let topics = undefined;
        if (this.props.topicData) {
            topics = [...this.props.topicData];
            for (let i = 0; i < topics.length; i++) {
                topics[i] = { ...topics[i] };
                topics[i].formatterId = i;
            }
        }

     

        const colProps = [
            {
                dataField: 'name',
                width: 31
                headerStyle: this.props.headerStyle
            },
            {
                dataField: 'subscriptionCount',
                width: 30
                headerStyle: this.props.headerStyle,
                align: 'right'
            },
            {
                dataField: 'topicStatus',
                text: 'Status',
                width: 30
            },
            {
                dataField: 'formatterId',
                text: ' ',
                width: 9,
                formatter: (cell, row, rowIndex) => {
                    return (
                        <Button bsSize='xsmall' onClick={() => pageSwitcher.switchToPage(PAGES.CrudPage, { endpointType: EndpointTypes.TOPIC, selectedEndpoint: row.name })} >
                            edit
                        </Button>
                    );
                }
                headerStyle: this.props.headerStyle
            }
        ];

        let selectRow = {
            bgColor: palerBlue,
            selected: this.props.currentlySelectedName
        };

        return (
            <DataTable
                name='TopicList'
                colProps={colProps}
                uniqueKeyColumn='name'
                dataToDisplay={topics}
                defaultHover
                onRowClick={this.props.clickFunction}
                selectRow={selectRow}
                searchable
            />
        );
    }
}
