import './DataTable.css';
import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

export class DataTable extends Component {
    // QQ JF MK
    // Sort out what happens when no data has been retrieved yet, or partial props is input
    render() {
        const TableHeaderColNames = this.props.TableHeaderColNames; //an array ofthe table header values
        const columnDataNames = this.props.columnDataNames;
        const columnWidths = this.props.columnWidths;
        const DataToDisplay = this.props.DataToDisplay;

        let columns = [];
        for (let i = 0; i < TableHeaderColNames.length; i++) {
            columns.push({
                dataField: columnDataNames[i],
                text: TableHeaderColNames[i],
                headerStyle: { width: columnWidths[i] }
            });
        }
        const output = DataToDisplay ? 
            <BootstrapTable keyField="number" data={DataToDisplay} rowClasses="HighlightOnRowHover" columns={columns} />
         : 
            <p>No data has been retrieved yet.</p>
        ;
        return output;
    }
}
