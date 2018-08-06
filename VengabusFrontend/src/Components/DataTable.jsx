import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { palerBlue } from '../colourScheme';

/*
Returns a table created from an input object
Props:
    dataToDisplay: (REQUIRED) {array of objects} contains the data to be displayed in the table
    colProps: (REQUIRED) {array of objects} contains properties regarding specific columns
        dataField: (REQUIRED) {string} specifies the name of the property of DataToDisplay which is to be displayed in the column
        text: (REQUIRED) {string} text which is to be displayed in the header of the column
        headerStyle: (RECOMMENDED) {object} contains CSS styling for the header
        hidden: (OPTIONAL) {Boolean} If true then the column will be hidden. Default is false.
        formatter: (OPTIONAL) {function} Can be used to render more complicated stuff within the cells, can change what to render based on current cell.
                    Takes arguments (cell, row, rowIndex) and should return a string or a JSX element to be rendered within the cell.
                    For example if you want to render a button within the column then you can pass the following to the formatter:
                    (cell, row, rowIndex) => {
                        return(
                            <Button onClick={() => onClickFunction(row)}>
                            Do something with the data in the row
                            </ Button>
                        )
                    }
    rowEvents: (OPTIONAL) Object which contains functions that are called on certain events of the row. For example:
                RowEvents = {
                    onClick: (row, rowIndex, e) => {
                        ....
                    }
                }
                where row is an object which contains all the information which is in that row
    rowClasses: (OPTIONAL) {css class or function} If function then it takes the same arguments as above and returns a css class.
    onRowClick: (OPTIONAL) Function to call when a row is clicked. Arguments are the same as above.
                           Note that this is merely a more convenience wrapper for a common usages of rowEvents. It must not be defined in both.
    bordered: (OPTIONAL) {Boolean} If true then no vertical borders. Default is false.
    condensed: (OPTIONAL) {Boolean} If true then reduces padding in the table. Default is false.
    hover: (OPTIONAL) {Boolean} If true then background color of table will change to light grey on hover
    selectRow: (OPTIONAL) defines settings relating to selecting a row by clicking on it.
                selected: {int or String} This identifies a row to be rendered as currently Selected.
                          It is used by the table itself to persist selection status across re-renders, but can also be used by the developer to indicate an initial 'default' selection.
                          Note that setting an initial selection does NOT invoke any relevant onSelect functions - it ONLY does css etc.
                          Row to be selected is determined by:
                              If {int} then index (0-based, excluding header) of row.
                              If {string} then search for row matching to match text of the key Column.
                          The int option (index based initial selection) is implemented within this wrapper, by manually replacing the int with the appropriate string from the data.
                style: {Object} Sets css style to be passed in to the selected row.
                classes: {String} allows passing in css classes for styling (not an array)
                bgColor: {String} sets background color of selected row, will throw an error if style or classes is defined
                onSelect: {Function(row, isSelect, rowIndex, e)} called when row is selected (clicked)
    NOTES: 
            Every time a function will be called with one of the arguments being 'row' it will contain a 'key' property which is the index of the row.

Potentially useful in the future (find it in the API docs):
    sorting: Column Props => sort / sortFunc / onSort
    filtering: Column Props => filter / filterValue
                or Column Filter Props

For more info see:
https://react-bootstrap-table.github.io/react-bootstrap-table2/
*/
export class DataTable extends Component {

    render() {
        let { colProps, dataToDisplay, rowEvents, name, onRowClick, selectRow, ...otherProps } = this.props;
        if (typeof rowEvents === 'undefined') { rowEvents = {}; }
        let finalRowEvents = undefined;

        if (dataToDisplay) {
            if (!colProps) {
                throw new Error('column property object is not defined in ' + name);
            }

            if (rowEvents.onClick && onRowClick) {
                throw new Error('the onClick event for rows is defined multiple times in ' + name);
            }
            onRowClick = onRowClick || rowEvents.onClick || function () { };
            finalRowEvents = { ...(rowEvents), onClick: onRowClick };

            if (selectRow) {
                if ((selectRow.style || selectRow.classes) && selectRow.bgColor) {
                    throw new Error('background color of selected row may be multiply defined in ' + name);
                }
                selectRow.mode = 'radio';
                selectRow.hideSelectColumn = true;
                selectRow.clickToSelect = true;
                if (typeof selectRow.selected === 'number') {
                    selectRow.selected = selectRow.selected.toString();
                    // Add hidden column to use as a key that will match the row index
                    dataToDisplay = [];
                    for (let i = 0; i < this.props.dataToDisplay.length; i++) {
                        dataToDisplay.push({ ...(this.props.dataToDisplay[i]), key: i });
                    }
                    colProps = [
                        {
                            dataField: 'key',
                            text: 'key',
                            hidden: true
                        },
                        ...(this.props.colProps)
                    ];
                }
            }
        }

        return dataToDisplay ? (
            <BootstrapTable
                keyField={colProps[0].dataField}
                data={dataToDisplay}
                columns={colProps}
                rowEvents={finalRowEvents}
                selectRow={selectRow}
                {...otherProps}
            />
        ) : (
                <p>No data has been retrieved yet.</p>
            );
    }
}
