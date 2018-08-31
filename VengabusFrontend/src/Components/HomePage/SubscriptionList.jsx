import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { palerBlue } from '../../colourScheme';
import { EditSubscriptionButton } from '../Buttons/EditEndpointButton';


export class SubscriptionList extends Component {

    render() {
        const originalSubscriptionProps = this.props.subscriptionData;
        const subscriptionArray = originalSubscriptionProps ? [] : originalSubscriptionProps;
        if (originalSubscriptionProps) {
            for (let i = 0; i < originalSubscriptionProps.length; i++) {
                //needs to be cloned
                subscriptionArray.push({ ...originalSubscriptionProps[i] });
                const currentMessageArray = subscriptionArray[i];
                if (currentMessageArray.mostRecentDeadletter && currentMessageArray.mostRecentDeadletterLoaded) {
                    currentMessageArray.mostRecentDeadletter = formatTimeStamp(currentMessageArray.mostRecentDeadletter);
                }
            }
        }


        const colProps = [
            {
                dataField: 'name',
                width: 23,
                headerStyle: this.props.headerStyle,
                search: true
            },
            {
                //qq this is only a workaround for the table not rerendering itself. Solve this properly later.
                dataField: 'activeMessageCount',
                text: 'Active / Deadletter Message Counts',
                width: 46,
                formatter: (cell, row, rowIndex) => {
                    return (`${row.activeMessageCount} / ${row.deadletterMessageCount}`);
                },
                headerStyle: this.props.headerStyle
            },
            {
                dataField: 'mostRecentDeadletter',
                width: 23
            },
            {
                dataField: '',
                text: ' ',
                width: 8,
                formatter: (cell, row, rowIndex) => {
                    return (
                        <EditSubscriptionButton subscriptionName={row.name} parentTopic={row.topicName} />
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
                name='subscriptionList'
                colProps={colProps}
                dataToDisplay={subscriptionArray}
                uniqueKeyColumn='name'
                defaultHover
                onRowClick={this.props.clickFunction}
                selectRow={selectRow}
                searchable
                pagination={{ defaultPageSize: 25, sizePerPageList: [10, 25, 50, 100] }}
            />
        );
    }
}
