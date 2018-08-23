import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { palerBlue } from '../../colourScheme';
import { EditQueueButton } from '../EditEndpointButton';


export class QueueList extends Component {

    render() {
        const queueProp = this.props.queueData;
        let queueArray = queueProp ? [] : undefined;
        if (queueProp) {
            for (let i = 0; i < queueProp.length; i++) {
                //needs to be cloned
                queueArray.push({ ...queueProp[i] });
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
