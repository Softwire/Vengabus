import React, { Component } from 'react';
import { DataTable } from './DataTable';

export class QueueList extends Component {
    onRowClick(row) {
        window.open('http://google.com', '_blank');
    }

    render() {
        const queueArray = this.props.queueData;

        let queueTable = 
            <DataTable
                TableHeaderColNames={['Number', 'Name', 'Status']}
                columnDataNames={['number', 'name', 'status']}
                columnWidths={['10%', '50%', '40%']}
                DataToDisplay={queueArray}
                onRowClick={this.onRowClick}
            />
        ;

        return queueTable;
    }
}
