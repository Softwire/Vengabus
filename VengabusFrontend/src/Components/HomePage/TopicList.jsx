import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { palerBlue } from '../../colourScheme';
import { EditTopicButton } from '../Buttons/EditEndpointButton';

export class TopicList extends Component {

    render() {
        // If there is data we want to clone it. If not, we need to preserve whether the data is null or undefined.
        const originalTopicProps = this.props.topicData;
        const topics = originalTopicProps ? [] : originalTopicProps;
        if (originalTopicProps) {
            for (let i = 0; i < originalTopicProps.length; i++) {
                topics.push({ ...originalTopicProps[i] });
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
