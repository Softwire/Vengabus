import React, { Component } from "react";
import { DataTable } from "./DataTable";

export class QueueList extends Component {
  onRowClick(row) {
    window.open("http://google.com", "_blank");
  }

  render() {
    const queueArray = this.props.queueData;

    const ColProps = [
      {
        dataField: "number",
        text: "Number",
        headerStyle: { width: "10%" }
      },
      {
        dataField: "name",
        text: "Name",
        headerStyle: { width: "50%" }
      },
      {
        dataField: "status",
        text: "Status",
        headerStyle: { width: "40%" }
      }
    ];

    const RowEvents = {
      onClick: (e, row, rowIndex) => {
        console.log(row);
      }
    };

    return (
      <DataTable
        ColProps={ColProps}
        DataToDisplay={queueArray}
        RowEvents={RowEvents}
      />
    );
  }
}
