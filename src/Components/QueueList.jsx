import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export class QueueList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queueList: 'No data retrieved yet. Please enter a queue name.',
            rowMouseIsOver: null
        };
        this.isMouseOverRow = this.isMouseOverRow.bind(this);
        this.logMouseOverRow = this.logMouseOverRow.bind(this);
    }

    onRowClick(row) {
        window.open('http://google.com', '_blank');
    }

    logMouseOverRow(row) {
        this.setState((prevState) => ({ toggle: !prevState.toggle }));
    }

    isMouseOverRow(row) {
        return row.number === this.state.rowMouseIsOver ? 'background:#f12' : 'background:#fff';
    }

    render() {
        const queueArray = this.props.queueData;
        const options = {
            onRowClick: this.onRowClick,
            onRowMouseOver: this.logMouseOverRow
        };

        const queueTable = 
            <BootstrapTable data={queueArray} options={options} trClassName={this.isMouseOverRow}>
                <TableHeaderColumn width="10%" isKey dataField="number">
                    Number
                </TableHeaderColumn>
                <TableHeaderColumn width="60%" dataField="name">
                    Name
                </TableHeaderColumn>
                <TableHeaderColumn width="30%" dataField="status">
                    Status
                </TableHeaderColumn>
            </BootstrapTable>
        ;

        return queueTable;
    }
}
