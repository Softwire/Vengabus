import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { palerBlue } from '../../colourScheme';
import { EditTopicButton } from '../EditEndpointButton';

export class TopicList extends Component {

    render() {
        const originalTopicPorps = this.props.topicData;
        const topics = originalTopicPorps ? [] : originalTopicPorps;
        if (originalTopicPorps) {
            for (let i = 0; i < originalTopicPorps.length; i++) {
                topics.push({ ...originalTopicPorps[i] });
            }
        }

        const colProps = [
            {
                dataField: 'name',
                width: 31,
                headerStyle: this.props.headerStyle,
                search: true
            },
            {
                dataField: 'subscriptionCount',
                width: 30,
                headerStyle: this.props.headerStyle,
                align: 'right'
            },
            {
                dataField: 'topicStatus',
                text: 'Status',
                width: 30
            },
            {
                dataField: '',
                text: ' ',
                width: 9,
                formatter: (cell, row, rowIndex) => {
                    return (
                        <EditTopicButton topicName={row.name} />
                    );
                },
                headerStyle: this.props.headerStyle
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
                uniqueKeyColumn='name'
                dataToDisplay={topics}
                defaultHover
                onRowClick={this.props.clickFunction}
                selectRow={selectRow}
                searchable
                pagination={{ defaultPageSize: 25, sizePerPageList: [10, 25, 50, 100] }}
            />
        );
    }
}
