import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { palerBlue } from '../../colourScheme';
import { EditQueueButton } from '../EditEndpointButton';


export class QueueList extends Component {

    render() {
        const originalQueueProps = this.props.queueData;
        const queueArray = originalQueueProps ? [] : originalQueueProps;
        if (originalQueueProps) {
            for (let i = 0; i < originalQueueProps.length; i++) {
                //needs to be cloned
                queueArray.push({ ...originalQueueProps[i] });
                const currentMessageArray = queueArray[i];
                if (currentMessageArray.mostRecentDeadLetter && currentMessageArray.mostRecentDeadLetterLoaded) {
                    currentMessageArray.mostRecentDeadLetter = formatTimeStamp(currentMessageArray.mostRecentDeadLetter);
                }
            }
        }



        const colProps = [
            {
                dataField: 'name',
                width: 23,
                headerStyle: this.props.headerStyle
            },
            {
                //qq this is only a workaround for the table not rerendering itself. Solve this properly later.
                dataField: 'activeMessageCount',
                text: 'Active / Deadletter Message Counts',
                width: 46,
                formatter: (cell, row, rowIndex) => {
                    return (`${row.activeMessageCount} / ${row.deadletterMessageCount}`);
                },
                headerStyle: this.props.headerStyle,
                disableSearch: true
            },
            {
                dataField: 'mostRecentDeadLetter',
                width: 23
            },
            {
                dataField: '',
                text: ' ',
                width: 8,
                formatter: (cell, row, rowIndex) => {
                    return (
                        <EditQueueButton queueName={row.name} />
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
