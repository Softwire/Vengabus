import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { palerBlue } from '../../colourScheme';
import { EditTopicButton } from '../EditEndpointButton';

export class TopicList extends Component {

    render() {
        const topicProps = this.props.topicData;
        let topics = topicProps ? [] : undefined;
        if (topicProps) {
            for (let i = 0; i < topicProps.length; i++) {
                topics.push({ ...topicProps[i] });
            }
        }

        const colProps = [
            {
                dataField: 'name',
                width: 31,
                headerStyle: this.props.headerStyle
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
                dataField: undefined,
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
            />
        );
    }
}
