import React, { Component } from "react";
import { DataTable } from "./DataTable";
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';

export class QueueList extends Component {
    rowClickResponseFunction(e, row, rowIndex) { //pass this function as a prop to DataTable, call it when "row" is clicked on
        console.log(row);
    }

    render() {
        const queueArray = this.props.queueData;

        const ColProps = [
            {
                dataField: "number",
                text: "Number",
                headerStyle: {
                    width: "10%", textAlign: "center"
                }
            },
            {
                dataField: "name",
                text: "Name",
                headerStyle: { width: "50%", textAlign: "center" }
            },
            {
                dataField: "status",
                text: "Status",
                headerStyle: { width: "40%", textAlign: "center" }
            }
        ];

        const RowEvents = {
        }

        const tableRowStyle = css`
		          :hover {
		              border: 2px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;



        return (
            <DataTable
                ColProps={ColProps}
                DataToDisplay={queueArray}
                RowEvents={RowEvents}
                tableRowStyle={tableRowStyle}
                OnClick={this.rowClickResponseFunction}
            />
        );
    }
}
