import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { css } from 'emotion';
import { palerBlue, paleGreyBlue } from '../colourScheme';
import classNames from 'classnames';
import _ from 'lodash';
/*
Returns a table created from an input object
Props:
    dataToDisplay: (REQUIRED) {array of objects} Contains the data to be displayed in the table.
    name: (STRONGLY RECOMMENDED) {string} Will be included in the error messages to help identify the source.
    uniqueKeyColumn: (REQUIRED) {string} dataField property of the column (see colProps below) to be used as the key. If not unique then an error will be thrown.
    colProps: (REQUIRED) {array of objects} Contains properties regarding specific columns.
        dataField: (REQUIRED) {string} Specifies the name of the property of DataToDisplay which is to be displayed in the column.
        text: (OPTIONAL) {string} Override of the text which is to be displayed in the column header. If undefined the text is inferred from the dataField: myDataField => "My Data Field"
        width: (OPIONAL) {number} Width of the column. If defined in one column then must be defined in all columns (excluding hidden ones) and overall width has to add up to 100.
        headerStyle: (RECOMMENDED) {object} Contains CSS styling for the header. Width must be defined as above and not in here.
        hidden: (OPTIONAL) {boolean} If true then the column will be hidden. Default is false.
        formatter: (OPTIONAL) {function} Can be used to render more complicated html within the cells, including rendering dependent on cell value.
                    Takes arguments (cell, row, rowIndex) and should return a string or a JSX element to be rendered within the cell.
                    For example if you want to render a button within the column then you can pass the following to the formatter:
                    (cell, row, rowIndex) => {
                        return(
                            <Button onClick={() => onClickFunction(cell, row, rowIndex)}>
                            Do something with the data in the row
                            </ Button>
                        )
                    }
                    Note that row is the object from dataToDisplay corresponding to the specific row.
    rowEvents: (OPTIONAL) {object} Contains functions that are called on certain events of the row. For example:
                RowEvents = {
                    onClick: (row, rowIndex, e) => {
                        ....
                    }
                }
    onRowClick: (OPTIONAL) {function} Called when a row is clicked. Arguments are the same as above.
                Note that this is merely a more convenience wrapper for a common usages of rowEvents. It must not be defined in both.
    selectRow: (OPTIONAL) {object} Defines settings relating to selecting a row by clicking on it.
                selected: {int or string} This identifies a row to be rendered as currently Selected.
                          It is used by us to persist selection status across re-renders, but can also be used to indicate an initial 'default' selection.
                          Note that setting an initial selection does NOT invoke any relevant onSelect functions - it ONLY does css etc.
                          Row to be selected is determined by:
                              If {int} then index (0-based, excluding header) of row.
                              If {string} then search for row matching to match text of the key Column.
                          The int option (index based initial selection) is implemented within this wrapper, by manually replacing the int with the appropriate string from the data.
                style: {object} Sets css style to be passed in to the selected row.
                classes: {string} Allows passing in css classes for styling (not an array).
                bgColor: {string} Sets background color of selected row, will throw an error if style or classes is defined.
                onSelect: {function(row, isSelect, rowIndex, e)} Called when row is selected (clicked).
    rowClasses: (OPTIONAL) {string} CSS class that applies to the rows.
    bordered: (OPTIONAL) {boolean} If false then no vertical borders. Default is true.
    condensed: (OPTIONAL) {boolean} If true then reduces padding in the table. Default is false.
    defaultHover: (OPTIONAL) {boolean} If true then default on hover styling will be applied.
    <underlyingLibraryProps>: (OPTIONAL) Any props not specified here will be handed down to BootstrapTable untouched.

    NOTE: Every time a function will be called with one of the arguments being 'row' it will contain a 'key' property which is the index of the row.

Potentially useful in the future (find it in the API docs):
    sorting: Column Props => sort / sortFunc / onSort
    filtering: Column Props => filter / filterValue
                or Column Filter Props

For more info see:
https://react-bootstrap-table.github.io/react-bootstrap-table2/
*/
export class DataTable extends Component {

    throwIfOnlyHiddenColumns = () => {
        const onlyHiddenColumns = _(this.props.colProps).every(col => col.hidden);
        if (onlyHiddenColumns) {
            throw new Error('cannot use table with only hidden columns (in ' + this.props.name + ')');
        }
    }

    getValidatedKeyColumn = (uniqueKeyColumn) => {
        uniqueKeyColumn = _(this.props.colProps).findIndex(col => col.dataField === uniqueKeyColumn);
        if (typeof uniqueKeyColumn === 'undefined' || uniqueKeyColumn === -1) {
            throw new Error('need a valid key column in ' + this.props.name);
        }
        if (!this.isColumnUnique(uniqueKeyColumn)) {
            throw new Error('key column specified in ' + this.props.name + ' is not unique');
        }
        return uniqueKeyColumn;
    }

    isColumnUnique = (index) => {
        const dataField = this.props.colProps[index].dataField;
        const colData = [...this.props.dataToDisplay].map((object) => object[dataField]);
        return (new Set(colData).size === colData.length);
    }

    applyDefaultHeaderTextIfNecessary = (colProps) => {
        for (let col of colProps) {
            if (!col.text) {
                col.text = this.getTextFromDatafield(col.dataField);
            }
        }
    }

    getTextFromDatafield = (dataField) => {
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

    applyValidatedWidth = (colProps) => {
        this.checkIfHeaderStyleHasWidth(colProps);

        const widthShouldExist = this.determineIfWidthShouldExist(colProps);

        this.checkIfNoColumnsHaveWidths(widthShouldExist, colProps);

        if (widthShouldExist) {
            let totalWidth = 0;
            for (let i = 0; i < colProps.length; i++) {
                if (!colProps[i].hidden) {
                    const width = this.getColumnWidthWhichShouldExist(colProps, i);
                    totalWidth += width;
                    colProps[i].headerStyle.width = width.toString() + '%';
                    delete colProps[i].width;
                }
            }
            if (totalWidth !== 100) {
                throw new Error('overall width of columns is not 100% in ' + this.props.name);
            }
        }
    }

    checkIfHeaderStyleHasWidth = (colProps) => {
        for (let col of colProps) {
            if (!col.headerStyle) {
                col.headerStyle = {};
            }

            if (col.headerStyle.width) {
                const errorDataField = col.dataField;
                throw new Error(`width of column must not be specified in the style (in ${this.props.name}:${errorDataField})`);
            }
        }
    }

    determineIfWidthShouldExist = (colProps) => {
        let columnIndex = 0;
        while (colProps[columnIndex].hidden) { columnIndex++; } //Skip any leading hidden columns.
        return typeof colProps[columnIndex].width !== 'undefined';
    }

    checkIfNoColumnsHaveWidths = (widthShouldExist, colProps) => {
        if (!widthShouldExist) {
            const allColsHaveNoWidth = _(colProps).every(col => typeof col.width === 'undefined');
            if (!allColsHaveNoWidth) {
                const firstNonHiddenDataField = _(colProps).first(col => !col.hidden).dataField;
                throw new Error(`missing column width definition in ${this.props.name}:${firstNonHiddenDataField}`);
            }
        }
    }

    getColumnWidthWhichShouldExist = (colProps, index) => {
        const width = colProps[index].width;
        if (typeof width === 'undefined') {
            const errorDataField = colProps[index].dataField;
            throw new Error(`missing column width definition in ${this.props.name}:${errorDataField}`);
        }
        return width;
    }

    validateAndConfigureRowEvents = (rowEvents, onRowClick) => {
        if (typeof rowEvents === 'undefined') { rowEvents = {}; }
        if (rowEvents.onClick && onRowClick) {
            throw new Error('the onClick event for rows is defined multiple times in ' + this.props.name);
        }
        onRowClick = onRowClick || rowEvents.onClick;
        rowEvents = { ...(rowEvents), onClick: onRowClick };
        if (!rowEvents.onClick) {
            delete rowEvents.onClick;
        }
        return rowEvents;
    }

    validateAndConfigureSelectRow = (selectRow, keyColumnIndex) => {
        if (selectRow) {
            if ((selectRow.style || selectRow.classes) && selectRow.bgColor) {
                throw new Error('background color of selected row may be multiply defined in ' + this.props.name);
            }
            selectRow.mode = 'radio';
            selectRow.hideSelectColumn = true;
            selectRow.clickToSelect = true;
            if (typeof selectRow.selected === 'number') {
                const keyDataField = this.props.colProps[keyColumnIndex].dataField;
                selectRow.selected = this.props.dataToDisplay[selectRow.selected][keyDataField];
            }
            selectRow.selected = selectRow.selected ? [selectRow.selected] : undefined;
        }
        return selectRow;
    }

    configureDefaultHover = (defaultHover, rowClasses) => {
        if (defaultHover) {
            const hoverClass = css`
		          :hover {
		              border: 1px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;
            return classNames(rowClasses, hoverClass);
        }
        return rowClasses;
    }

    configureCursor = (rowClasses, rowEvents, selectRow) => {
        if (rowEvents.onClick || selectRow) {
            const pointerCurser = css`
                cursor: pointer;
            `;

            return classNames(rowClasses, pointerCurser);
        }
        return rowClasses;
    }

    configureRowClasses = (defaultHover, rowClasses, rowEvents, selectRow) => {
        const partiallyProcessedRowClasses = this.configureDefaultHover(defaultHover, rowClasses);
        return this.configureCursor(partiallyProcessedRowClasses, rowEvents, selectRow);
    }

    render() {
        let { dataToDisplay, name, uniqueKeyColumn, colProps, rowEvents, onRowClick, selectRow, rowClasses, defaultHover, ...otherProps } = this.props;
        let keyColumnIndex;
        let finalRowEvents;
        let finalSelectRow;
        let finalRowClasses;

        if (dataToDisplay) {
            if (!colProps) {
                throw new Error('column property object is not defined in ' + name);
            }

            this.throwIfOnlyHiddenColumns();
            keyColumnIndex = this.getValidatedKeyColumn(uniqueKeyColumn);
            this.applyDefaultHeaderTextIfNecessary(colProps);
            this.applyValidatedWidth(colProps);
            finalRowEvents = this.validateAndConfigureRowEvents(rowEvents, onRowClick);
            finalSelectRow = this.validateAndConfigureSelectRow(selectRow, keyColumnIndex);
            finalRowClasses = this.configureRowClasses(defaultHover, rowClasses, finalRowEvents, finalSelectRow);
        }

        const textAlign = css`
            text-align:center;
        `;
        const tableBorder = css`
             
             .table{
             margin-bottom:0px;
             border-top-style: solid;
             border-left-style: solid;
             border-right-style: solid;
             border-bottom-style: solid;
             }
         `;
        return dataToDisplay ? (
            <BootstrapTable
                data={dataToDisplay}
                keyField={colProps[keyColumnIndex].dataField}
                columns={colProps}
                rowEvents={finalRowEvents}
                selectRow={finalSelectRow}
                rowClasses={finalRowClasses}
                {...otherProps}
                striped
               
            />
        ) : (
                <p className={textAlign}>No data has been retrieved yet.</p>
            );
    }
}
