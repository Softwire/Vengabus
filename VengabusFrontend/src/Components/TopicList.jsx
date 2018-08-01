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
                headerStyle: { width: '30%', textAlign: 'center' }
            },
            {
                dataField: 'subscriptionCount',
                text: 'number of subscriptions',
                headerStyle: { width: '30%', textAlign: 'center' }
            },
            {
                dataField: 'topicStatus',
                text: 'Status',
                headerStyle: { width: '30%', textAlign: 'center' }
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
                dataToDisplay={topics}
                tableRowStyle={tableRowStyle}
                onRowClick={this.props.clickFunction}
                rowSelect={this.props.currentlySelectedName}
            />
        );
    }
}
