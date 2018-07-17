import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { css } from "react-emotion";
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
                    onClick: (row, rowIndex, e) => {
                        ....
                    }
                }
                where row is an object which contains all the information which is in that row

For more info see:
https://react-bootstrap-table.github.io/react-bootstrap-table2/
*/
export class DataTable extends Component {
  render() {
    const ColProps = this.props.ColProps;
    const DataToDisplay = this.props.DataToDisplay;
    const RowEvents = this.props.RowEvents;
    const tableRowStyle = this.props.tableRowStyle;

    return DataToDisplay ? (
      <BootstrapTable
        keyField={ColProps[0].dataField} //use the left-most column as the keyfield for the table
        data={DataToDisplay}
        rowClasses={tableRowStyle}
        columns={ColProps}
        rowEvents={RowEvents}
      />
    ) : (
        <p>No data has been retrieved yet.</p>
      );
  }
}
