import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { palerBlue } from '../colourScheme';

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

        let selectRow = {
            bgColor: palerBlue,
            selected: this.props.currentlySelectedName
        };

        return (
            <DataTable
                name='TopicList'
                colProps={colProps}
                keyColumn='name'
                dataToDisplay={topics}
                defaultHover
                onRowClick={this.props.clickFunction}
                selectRow={selectRow}
            />
        );
    }
}
