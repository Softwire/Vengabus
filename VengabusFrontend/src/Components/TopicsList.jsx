import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';

export class TopicList extends Component {

    render() {
        const topics = [...this.props.topicData];
        for (let i = 0; i < topics.length; i++) {
            topics[i].numberOfSubscriptions = topics[i].subs.length;
        }

        const colProps = [
            {
                dataField: 'TopicName',
                text: 'Topic Name',
                headerStyle: {
                    width: '10%', textAlign: 'center'
                }
            },
            {
                dataField: 'numberOfSubscriptions',
                text: 'number of subscriptions',
                headerStyle: { width: '20%', textAlign: 'center' }
            }, {
                dataField: 'status',
                text: 'Status',
                headerStyle: { width: '20%', textAlign: 'center' }
            }
        ];

        const tableRowStyle = css`
		          :hover {
		              border: 2px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;

        return (
            <DataTable
                name='TopicList'
                colProps={colProps}
                dataToDisplay={topics}
                tableRowStyle={tableRowStyle}
                onRowClick={this.rowClickResponseFunction}
            />
        );
    }
}
