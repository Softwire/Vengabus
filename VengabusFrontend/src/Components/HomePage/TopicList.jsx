import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { palerBlue } from '../../colourScheme';
import { css } from 'react-emotion';

export class TopicList extends Component {

    render() {

        const topics = this.props.topicData;

        //92 for height of 3 lines of text
        const minHeight = css`
                min-height:92px;
                height:92px;
            `;


        const colProps = [
            {
                dataField: 'name',
                width: 34,
                headerClasses: minHeight
            },
            {
                dataField: 'subscriptionCount',
                width: 33,
                headerClasses: minHeight
                align: 'right'
            },
            {
                dataField: 'topicStatus',
                text: 'Status',
                width: 33,
                headerClasses: minHeight
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
