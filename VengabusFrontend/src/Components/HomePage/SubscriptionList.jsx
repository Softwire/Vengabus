import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { palerBlue } from '../../colourScheme';
import { EditSubscriptionButton } from '../EditEndpointButton';


export class SubscriptionList extends Component {

    render() {
        const originalSubscriptionProps = this.props.subscriptionData;
        const subscriptionArray = originalSubscriptionProps ? [] : undefined;
        if (originalSubscriptionProps) {
            for (let i = 0; i < originalSubscriptionProps.length; i++) {
                //needs to be cloned
                subscriptionArray.push({ ...originalSubscriptionProps[i] });
                const currentMessageArray = subscriptionArray[i];
                if (currentMessageArray.mostRecentDeadLetter && currentMessageArray.mostRecentDeadLetterLoaded) {
                    currentMessageArray.mostRecentDeadLetter = formatTimeStamp(currentMessageArray.mostRecentDeadLetter);
                }
            }
        }


        const colProps = [
            {
                dataField: 'name',
                width: 23,
                headerStyle: this.props.headerStyle
            },
            {
                dataField: '',
                text: 'Active / Deadletter Message Counts',
                width: 46,
                formatter: (cell, row, rowIndex) => {
                    return (`${row.activeMessageCount} / ${row.deadletterMessageCount}`);
                },
                headerStyle: this.props.headerStyle
            },
            {
                dataField: 'mostRecentDeadLetter',
                width: 23
            },
            {
                //qq this is only to solve the duplicate key issue. Properly solve this later.
                dataField: 'crud',
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
            />
        );
    }
}
