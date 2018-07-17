import React, { Component } from "react";
import { DataTable } from "./DataTable";
import { css } from 'react-emotion';
import { paleGreyBlue, mediumGreyBlue, palerBlue } from '../colourScheme';

export class QueueList extends Component {
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
            />
        );
    }
}
