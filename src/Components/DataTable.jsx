import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
/*
Returns a table created from an input object
Props:
    dataToDisplay: the object which contains the data to be displayed in the table (REQUIRED)
    colProps: contains properties regarding specific columns (format: array of objects)
        dataField: specifies the name of the property of DataToDisplay which is to be displayed in the column (REQUIRED)
        text: text which is to be displayed in the header of the column (REQUIRED)
        headerStyle: object which contains CSS styling for the header (RECOMMENDED)
    rowEvents: Object which contains functions that are called on certain events of the row (OPTIONAL). For example:
                RowEvents = {
                    event: (row, rowIndex, e) => {
                        ....
                    }
                }
                where row is an object which contains all the information which is in that row
    onRowClick: Function to call when a row is clicked. Arguments are the same as above. Note that this could theoretically
                be defined in rowEvents, but if it is defined twice then an error will be thrown.

For more info see:
https://react-bootstrap-table.github.io/react-bootstrap-table2/
*/
export class DataTable extends Component {
    render() {
        const colProps = this.props.colProps;
        const dataToDisplay = this.props.dataToDisplay;
        const tableRowStyle = this.props.tableRowStyle;
        const rowEvents = this.props.rowEvents;
        const name = this.props.name;
        let onRowClick = this.props.onRowClick;
        let finalRowEvents = undefined;

        if (dataToDisplay) {
            if (!colProps) {
                throw new Error('column property object is not defined in ' + name);
            } else if (!colProps[0].dataField) {
                throw new Error('colProps.dataField is undefined in ' + name + ', cannot determine what data to display in which column.');
            } else if (!colProps[0].text) {
                throw new Error('colProps.text is undefined in ' + name + ', cannot determine header text of columns.');
            }

            if (rowEvents) {
                if (rowEvents.onClick && onRowClick) {
                    throw new Error("the onClick event for rows is defined multiple times in " + name);
                }
                onRowClick = onRowClick || rowEvents.onClick || function () { };
                finalRowEvents = { ...(rowEvents), onClick: onRowClick };
            } else if (onRowClick) {
                finalRowEvents = {
                    onClick: onRowClick
                };
            }
        }

        return dataToDisplay ? (
            <BootstrapTable
                keyField={colProps[0].dataField} //use the left-most column as the keyfield for the table
                data={dataToDisplay}
                rowClasses={tableRowStyle}
                columns={colProps}
                rowEvents={finalRowEvents}
            />
        ) : (
                <p>No data has been retrieved yet.</p>
            );
    }
}
