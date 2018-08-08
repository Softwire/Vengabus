import React, { Component } from 'react';
import { DataTable } from './DataTable';
import moment from 'moment';
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
                    currentMessageArray.mostRecentDeadLetter = moment(currentMessageArray.mostRecentDeadLetter).format("DD-MM-YYYY");
                }
            }
        }

        const colProps = [
            {
                dataField: 'name',
                text: 'Name',
                width: 25,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'activeMessageCount',
                text: 'active Message Count',
                width: 25,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'deadletterMessageCount',
                text: 'dead Message Count',
                width: 25,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'mostRecentDeadLetter',
                text: 'most Recent Deadletter',
                width: 25,
                headerStyle: { textAlign: 'center' }
            }
        ];

        let selectRow = {
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
                keyColumn='name'
            />
        );
    }
}
