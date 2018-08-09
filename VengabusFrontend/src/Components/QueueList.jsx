import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { formatTimeStamp } from '../Helpers/FormattingHelpers';
import { palerBlue } from '../colourScheme';

export class QueueList extends Component {

    render() {
        let queueArray = undefined;
        if (this.props.queueData) {
            queueArray = [...this.props.queueData];

            for (let i = 0; i < queueArray.length; i++) {
                //needs to be cloned
                queueArray[i] = { ...queueArray[i] };
                const currentMessageArray = queueArray[i];
                if (currentMessageArray.mostRecentDeadLetter) {
                    currentMessageArray.mostRecentDeadLetter = formatTimeStamp(currentMessageArray.mostRecentDeadLetter);
                }
            }
        }

        const colProps = [
            {
                dataField: 'name',
                width: 25,
            },
            {
                dataField: 'activeMessageCount',
                width: 25,
            },
            {
                dataField: 'deadletterMessageCount',
                headerStyle: { width: '25%', 'height': '60px'}
            },
            {
                dataField: 'mostRecentDeadLetter',
                width: 25,
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
            />
        );
    }
}
