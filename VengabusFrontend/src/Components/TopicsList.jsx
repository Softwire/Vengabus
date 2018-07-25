import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';

export class TopicsList extends Component {

    render() {

        const topics = this.props.topicData;

        const colProps = [
            {
                dataField: 'name',
                text: 'Topic Name',
                headerStyle: {
                    width: '10%', textAlign: 'center'
                }
            },
            {
                dataField: 'subscriptionCount',
                text: 'number of subscriptions',
                headerStyle: { width: '20%', textAlign: 'center' }
            }, {
                dataField: 'topicStatus',
                text: 'Status',
                headerStyle: { width: '20%', textAlign: 'center' }
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
                onRowClick={this.props.clickFun}
                rowSelect={this.props.CurrentSelect}
            />
        );
    }
}
