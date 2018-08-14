import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { formatTimeStamp } from '../Helpers/FormattingHelpers';
import { palerBlue } from '../colourScheme';

export class SubscriptionList extends Component {

    render() {

        let subscriptionArray = undefined;
        if (this.props.subscriptionData) {
            subscriptionArray = [...this.props.subscriptionData];

            for (let i = 0; i < subscriptionArray.length; i++) {
                //needs to be cloned
                subscriptionArray[i] = { ...subscriptionArray[i] };
                const currentMessageArray = subscriptionArray[i];
                if (currentMessageArray.mostRecentDeadLetter) {
                    currentMessageArray.mostRecentDeadLetter = formatTimeStamp(currentMessageArray.mostRecentDeadLetter);
                }
            }
        }


        const colProps = [
            {
                dataField: 'name',
                width: 25,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'activeMessageCount',
                width: 25,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'deadletterMessageCount',
                width: 25,
                headerStyle: { textAlign: 'center' }
            }, {
                dataField: 'mostRecentDeadLetter',
                width: 25,
                headerStyle: { textAlign: 'center' }
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
            />
        );
    }
}
