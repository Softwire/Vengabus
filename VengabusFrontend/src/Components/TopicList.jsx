import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';

export class TopicList extends Component {

    render() {

        const topics = this.props.topicData;

        const colProps = [
            {
                dataField: 'name',
                text: 'Topic Name',
                width: 34,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'subscriptionCount',
                text: 'number of subscriptions',
                width: 33,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'topicStatus',
                text: 'Status',
                width: 33,
                headerStyle: { textAlign: 'center' }
            }
        ];

        const tableRowStyle = css`
		          :hover {
		              border: 1px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;

        return (
            <DataTable
                name='TopicList'
                colProps={colProps}
                keyColumn='name'
                dataToDisplay={topics}
                tableRowStyle={tableRowStyle}
                onRowClick={this.props.clickFunction}
                rowSelect={this.props.currentlySelectedName}
            />
        );
    }
}
