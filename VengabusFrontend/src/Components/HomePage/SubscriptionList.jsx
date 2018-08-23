import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { palerBlue } from '../../colourScheme';
import { EditSubscriptionButton } from '../EditEndpointButton';


export class SubscriptionList extends Component {

    render() {
        const subscriptionProp = this.props.subscriptionData;
        let subscriptionArray = subscriptionProp ? [] : undefined;
        if (subscriptionProp) {
            for (let i = 0; i < subscriptionProp.length; i++) {
                //needs to be cloned
                subscriptionArray.push({ ...subscriptionProp[i] });
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
                dataField: 'activeMessageCount',
                width: 23,
                align: 'right',
                headerStyle: this.props.headerStyle
            },
            {
                dataField: 'deadletterMessageCount',
                width: 23,
                headerStyle: this.props.headerStyle,
                align: 'right'
            },
            {
                dataField: 'mostRecentDeadLetter',
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
            />
        );
    }
}
