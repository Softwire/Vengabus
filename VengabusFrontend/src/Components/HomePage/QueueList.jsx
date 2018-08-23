import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { palerBlue } from '../../colourScheme';
import { Button } from 'react-bootstrap';
import { pageSwitcher, PAGES } from '../../Pages/PageSwitcherService';
import { EndpointTypes } from '../../Helpers/EndpointTypes';

export class QueueList extends Component {

    render() {
        let queueArray = undefined;
        if (this.props.queueData) {
            queueArray = [...this.props.queueData];

            for (let i = 0; i < queueArray.length; i++) {
                //needs to be cloned
                queueArray[i] = { ...queueArray[i] };
                const currentMessageArray = queueArray[i];
                if (currentMessageArray.mostRecentDeadLetter && currentMessageArray.mostRecentDeadLetterLoaded) {
                    currentMessageArray.mostRecentDeadLetter = formatTimeStamp(currentMessageArray.mostRecentDeadLetter);
                }
                queueArray[i].formatterId = i;
            }
        }



        const colProps = [
            {
                dataField: 'name',
                width: 23,
                headerStyle: this.props.headerStyle
            },
            {
                dataField: 'activeMessageCount',
                width: 23,
                headerStyle: this.props.headerStyle,
                align: 'right'
            },
            {
                dataField: 'deadletterMessageCount',
                width: 23,
                headerStyle: this.props.headerStyle,
                align: 'right'
            },
            {
                dataField: 'mostRecentDeadLetter',
                width: 23
            },
            {
                dataField: 'formatterId',
                text: ' ',
                width: 8,
                formatter: (cell, row, rowIndex) => {
                    return (
                        <Button bsSize='xsmall' onClick={() => pageSwitcher.switchToPage(PAGES.CrudPage, { endpointType: EndpointTypes.QUEUE, selectedEndpoint: row.name })} >
                            edit
                        </Button>
                    );
                },
                headerStyle: this.props.headerStyle
            }
        ];

        const selectRow = {
            bgColor: palerBlue,
            selected: this.props.currentlySelectedName
        };

        return (
            <DataTable
                name='QueueList'
                colProps={colProps}
                dataToDisplay={queueArray}
                defaultHover
                onRowClick={this.props.clickFunction}
                selectRow={selectRow}
                uniqueKeyColumn='name'
                searchable
            />
        );
    }
}
