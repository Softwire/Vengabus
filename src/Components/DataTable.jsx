import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { css } from 'react-emotion';
/*
Returns a table created from an input object
Required props:
    DataToDisplay: the object which contains the data to be displayed in the table
    ColProps: contains properties regarding specific columns (format: array of objects)
        dataField: specifies the name of the property of DataToDisplay which is to be displayed in the column
        text: text which is to be displayed in the header of the column
        headerStyle: object which contains CSS styling for the header

For more info see:
https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/basic-column.html
*/
export class DataTable extends Component {
    render() {
        const ColProps = this.props.ColProps;
        const DataToDisplay = this.props.DataToDisplay;

        const tableRowStyle = css`
            :hover {
                background-color: yellow;
            }
        `;

        return DataToDisplay ? 
            <BootstrapTable keyField="number" data={DataToDisplay} rowClasses={tableRowStyle} columns={ColProps} />
         : 
            <p>No data has been retrieved yet.</p>
        ;
    }
}
