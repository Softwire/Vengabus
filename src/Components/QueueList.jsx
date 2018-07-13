import React, { Component } from 'react';
import { Grid, Col, Row, Clearfix, ListGroupItem, ListGroup } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export class QueueList extends Component {
    /*constructor(props) {
        super(props);
        this.state = { queueList: 'No data retrieved yet. Please enter a queue name.' };
    }*/

    render() {
        //const queueArray = this.props.queueArray;
        const queueArray = [
            { number: 1, name: 'q1', status: 'active' },
            { number: 2, name: 'q2', status: 'active' },
            { number: 3, name: 'q3', status: 'dead' }
        ];

        const queueTable = 
            <BootstrapTable data={queueArray}>
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
