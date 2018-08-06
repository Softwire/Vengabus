import React, { Component } from 'react';
import { DataTable } from './DataTable';
import moment from 'moment';

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
                headerStyle: { width: '25%', textAlign: 'center' }
            },
            {
                dataField: 'activeMessageCount',
                text: 'active Message Count',
                headerStyle: { width: '25%', textAlign: 'center' }
            },
            {
                dataField: 'deadletterMessageCount',
                text: 'dead Message Count',
                headerStyle: { width: '25%', textAlign: 'center' }
            },
            {
                dataField: 'mostRecentDeadLetter',
                text: 'most Recent Deadletter',
                headerStyle: { width: '25%', textAlign: 'center' }
            }
        ];

        return (
            <DataTable
                name='QueueList'
                colProps={colProps}
                dataToDisplay={queueArray}
                defaultHover
                onRowClick={this.props.clickFunction}
                rowSelect={this.props.currentlySelectedName}
            />
        );
    }
}
