import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';

export class QueueList extends Component {
    // QQ
    // This is just a temporary function, update once the api is working for
    // getting the list of queues and individual queues
    rowClickResponseFunction(e, row, rowIndex) {
        console.log(row);
    }

    render() {
        const queueArray = this.props.queueData;

        const colProps = [
            {
                dataField: 'number',
                text: 'Number',
                headerStyle: {
                    width: '10%', textAlign: 'center'
                }
            },
            {
                dataField: 'name',
                text: 'Name',
                headerStyle: { width: '50%', textAlign: 'center' }
            },
            {
                dataField: 'status',
                text: 'Status',
                headerStyle: { width: '40%', textAlign: 'center' }
            }
        ];

        const tableRowStyle = css`
		          :hover {
		              border: 2px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;

        return (
            <DataTable
                name='QueueList'
                colProps={colProps}
                dataToDisplay={queueArray}
                tableRowStyle={tableRowStyle}
                onRowClick={this.rowClickResponseFunction}
            />
        );
    }
}
