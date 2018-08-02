import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { css } from 'emotion';
import { palerBlue, paleGreyBlue } from '../colourScheme';
/*
Returns a table created from an input object
Props:
    dataToDisplay: (REQUIRED) {array of objects} contains the data to be displayed in the table
    colProps: (REQUIRED) {array of objects} contains properties regarding specific columns
        dataField: (REQUIRED) {string} specifies the name of the property of DataToDisplay which is to be displayed in the column
        text: (OPTIONAL) {string} Text which is to be displayed in the header of the column. If undefined then the default is going to use dataField => Data Field.
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
    tableRowStyle: (OPTIONAL) className for the rows
    keyColumn: (OPTIONAL) Index of the column to be used as a key (defaults to 0). If specified but not unique then an error will be thrown. If not specified and default is not unique or -1 then a hidden key column willbe added.
    rowEvents: (OPTIONAL) Object which contains functions that are called on certain events of the row. For example:
                RowEvents = {
                    onClick: (row, rowIndex, e) => {
                        ....
                    }
                }
                where row is an object which contains all the information which is in that row
    rowClasses: (OPTIONAL) {string} CSS class that applies to the rows.
    onRowClick: (OPTIONAL) Function to call when a row is clicked. Arguments are the same as above.
                           Note that this is merely a more convenience wrapper for a common usages of rowEvents. It must not be defined in both.
    bordered: (OPTIONAL) {Boolean} If false then no vertical borders. Default is true.
    condensed: (OPTIONAL) {Boolean} If true then reduces padding in the table. Default is false.
    defaultHover: (OPTIONAL) {Boolean} If true then default on hover styling will be applied.
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

    addHiddenKeyColumn() {
        let dataToDisplay = [];
        for (let i = 0; i < this.props.dataToDisplay.length; i++) {
            dataToDisplay.push({ ...(this.props.dataToDisplay[i]), key: i });
        }
        const colProps = [
            {
                dataField: 'key',
                text: 'key',
                hidden: true
            },
            ...(this.props.colProps)
        ];

        return [dataToDisplay, colProps];
    }

    isColumnUnique(index) {
        const dataField = this.props.colProps[index].dataField;
        const colData = [...this.props.dataToDisplay].map((object) => object[dataField]);
        return (new Set(colData).size === colData.length);
    }

    getTextFromDatafield(dataField) {
        let text;
        for (let i = 0; i < dataField.length; i++) {
            let char = dataField[i];
            if (i === 0) {
                text = char.toUpperCase();
            } else if (char === char.toUpperCase()) {
                text += ' ';
                text += char;
            } else {
                text += char;
            }
        }
        return text;
    }

    render() {
        let { colProps, dataToDisplay, rowEvents, name, onRowClick, selectRow, defaultHover, rowClasses, keyColumn, ...otherProps } = this.props;
        if (typeof rowEvents === 'undefined') { rowEvents = {}; }
        let finalRowEvents = undefined;

        if (dataToDisplay) {
            let shouldAddKeyColumn = keyColumn === -1;

            if (!colProps) {
                throw new Error('column property object is not defined in ' + name);
            }
            for (let i = 0; i < colProps.length; i++) {
                if (!colProps[i].headerStyle) { colProps[i].headerStyle = {}; }
                else if (colProps[i].headerStyle.width) {
                    const errorDataField = colProps[i].dataField;
                    throw new Error(`width of column should not be specified in the style (in ${name}:${errorDataField})`);
                }
            }
            const widthShouldExist = typeof colProps[0].width !== 'undefined';
            if (widthShouldExist) {
                let totalWidth = 0;
                for (let i = 0; i < colProps.length; i++) {
                    const width = colProps[i].width;
                    if ((typeof width !== 'undefined') !== widthShouldExist) {
                        const errorDataField = colProps[i].dataField;
                        throw new Error(`missing column width definition in ${name}:${errorDataField}`);
                    }
                    totalWidth += width;
                    colProps[i].headerStyle.width = width.toString() + '%';
                    delete colProps[i].width;
                }
                if (totalWidth !== 100) {
                    throw new Error('overall width of columns is not 100% in ' + name);
                }
            }

            for (let i = 0; i < colProps.length; i++) {
                if (!colProps[i].text) {
                    colProps[i].text = this.getTextFromDatafield(colProps[i].dataField);
                }
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
                selectRow.selected = selectRow.selected ? [selectRow.selected] : undefined;
                selectRow.mode = 'radio';
                selectRow.hideSelectColumn = true;
                selectRow.clickToSelect = true;
                if (typeof selectRow.selected !== 'undefined' && typeof selectRow.selected === 'number') {
                    selectRow.selected = selectRow.selected.toString();
                    shouldAddKeyColumn = true;
                }
            }

            if (!shouldAddKeyColumn) {
                const isUnique = this.isColumnUnique(keyColumn ? keyColumn : 0);
                if (!isUnique) {
                    if (typeof keyColumn !== 'undefined') {
                        throw new Error('key column specified in ' + name + ' is not unique');
                    }
                    shouldAddKeyColumn = true;
                } else {
                    if (typeof keyColumn === 'undefined') { keyColumn = 0; }
                }
            }
            if (shouldAddKeyColumn) {
                keyColumn = 0;
                [dataToDisplay, colProps] = this.addHiddenKeyColumn();
            }

            if (defaultHover) {
                const hoverClass = css`
		          :hover {
		              border: 1px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;
                if (rowClasses) {
                    rowClasses = rowClasses + ' ' + hoverClass;
                } else {
                    rowClasses = hoverClass;
                }
            }
        }

        return dataToDisplay ? (
            <BootstrapTable
                keyField={colProps[keyColumn].dataField}
                data={dataToDisplay}
                columns={colProps}
                rowEvents={finalRowEvents}
                selectRow={selectRow}
                rowClasses={rowClasses}
                {...otherProps}
            />
        ) : (
                <p>No data has been retrieved yet.</p>
            );
    }
}
