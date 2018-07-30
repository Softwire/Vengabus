import React, { Button, Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { palerBlue } from '../colourScheme';

/*
Returns a table created from an input object
Props:
    dataToDisplay: (REQUIRED) the object which contains the data to be displayed in the table
    colProps: contains properties regarding specific columns (format: array of objects)
        dataField: (REQUIRED) specifies the name of the property of DataToDisplay which is to be displayed in the column
        text: (REQUIRED) text which is to be displayed in the header of the column
        headerStyle: (RECOMMENDED) object which contains CSS styling for the header
        formatter: (OPTIONAL) function that takes arguments (cell, row, rowIndex) and returns a string or a JSX element to be rendered within the cell
    rowEvents: (OPTIONAL) Object which contains functions that are called on certain events of the row. For example:
                RowEvents = {
                    event: (row, rowIndex, e) => {
                        ....
                    }
                }
                where row is an object which contains all the information which is in that row
    onRowClick: (OPTIONAL) Function to call when a row is clicked. Arguments are the same as above. Note that this could theoretically
                be defined in rowEvents, but if it is defined twice then an error will be thrown.
    bordered: (OPTIONAL) {Boolean} If true then no vertical borders
    condensed: (OPTIONAL) {Boolean} If true then reduces padding in the table
    hover: (OPTIONAL) {Boolean} If true then background color of table will change to light grey on hover
    selectRow: (OPTIONAL) defines what happens when row is selected
                selected: give index of row that is selected by default
                style: allows css style to be passed in to the selected row
                classes: allows passing in css classes for styling (not an array)
                bgColor: sets background color of selected row, will throw an error if style or classes is defined
                onSelect: function that is called when row is selected with arguments (row, isSelect, rowIndex, e)

For more info see:
https://react-bootstrap-table.github.io/react-bootstrap-table2/
*/
export class DataTable extends Component {

    render() {
        const colProps = this.props.colProps;
        const dataToDisplay = this.props.dataToDisplay;
        const tableRowStyle = this.props.tableRowStyle;
        const rowEvents = this.props.rowEvents || {};
        const name = this.props.name;
        let onRowClick = this.props.onRowClick;
        let finalRowEvents = undefined;
        const selectRow = this.props.selectRow;

        if (dataToDisplay) {
            if (!colProps) {
                throw new Error('column property object is not defined in ' + name);
            }

            if (rowEvents.onClick && onRowClick) {
                throw new Error("the onClick event for rows is defined multiple times in " + name);
            }
            onRowClick = onRowClick || rowEvents.onClick || function () { };
            finalRowEvents = { ...(rowEvents), onClick: onRowClick };

            if (selectRow) {
                if ((selectRow.style || selectRow.classes) && selectRow.bgColor) {
                    throw new Error("background color of selected row may be multiply defined in " + name);
                }
                selectRow.mode = 'radio';
                selectRow.hideSelectColumn = true;
                selectRow.clickToSelect = true;
            }

        }

        return dataToDisplay ? (
            <BootstrapTable
                keyField={colProps[1].dataField} //use the left-most column as the keyfield for the table
                data={dataToDisplay}
                rowClasses={tableRowStyle}
                columns={colProps}
                rowEvents={finalRowEvents}
                bordered={this.props.bordered}
                condensed={this.props.condensed}
                hover={this.props.hover}
                selectRow={selectRow}
            />
        ) : (
                <p>No data has been retrieved yet.</p>
            );
    }
}
