import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
/*
Returns a table created from an input object
Props:
    DataToDisplay: the object which contains the data to be displayed in the table (REQUIRED)
    ColProps: contains properties regarding specific columns (format: array of objects)
        dataField: specifies the name of the property of DataToDisplay which is to be displayed in the column (REQUIRED)
        text: text which is to be displayed in the header of the column (REQUIRED)
        headerStyle: object which contains CSS styling for the header (RECOMMENDED)
    RowEvents: Object which contains functions that are called on certain events of the row (OPTIONAL). For example:
                RowEvents = {
                    
                }
                where row is an object which contains all the information which is in that row
    Note: please define onClick events in the function "rowClickResponseFunction" and pass as a prop to DataTable.

For more info see:
https://react-bootstrap-table.github.io/react-bootstrap-table2/
*/
export class DataTable extends Component {
    render() {
        const ColProps = this.props.ColProps;
        const DataToDisplay = this.props.DataToDisplay;
        const tableRowStyle = this.props.tableRowStyle;
        const RowEvents = this.props.RowEvents;
        let rowClickResponseFunction = this.props.OnClick;

        if (RowEvents.onClick && rowClickResponseFunction) {
            throw new Error("Error: the row's onClick event is defined multiple times");
        }

        rowClickResponseFunction = rowClickResponseFunction || RowEvents.onClick || function () { };
        const finalRowEvents = { ...(this.props.RowEvents), onClick: rowClickResponseFunction };


        return DataToDisplay ? (
            <BootstrapTable
                keyField={ColProps[0].dataField} //use the left-most column as the keyfield for the table
                data={DataToDisplay}
                rowClasses={tableRowStyle}
                columns={ColProps}
                rowEvents={finalRowEvents}
            />
        ) : (
                <p>No data has been retrieved yet.</p>
            );
    }
}
