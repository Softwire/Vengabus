import React, { Component } from 'react';
import { DataTable } from './DataTable';
import moment from 'moment';
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
                    currentMessageArray.mostRecentDeadLetter = moment(currentMessageArray.mostRecentDeadLetter).format("DD-MM-YYYY");
                }
            }
        }


        const colProps = [
            {
                dataField: 'name',
                text: 'Name',
                width: 25,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'activeMessageCount',
                text: 'active Message Count',
                width: 25,
                headerStyle: { textAlign: 'center' }
            },
            {
                dataField: 'deadletterMessageCount',
                text: 'dead Message Count',
                width: 25,
                headerStyle: { textAlign: 'center' }
            }, {
                dataField: 'mostRecentDeadLetter',
                text: 'most Recent Deadletter',
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
                keyColumn='name'
                defaultHover
                onRowClick={this.props.clickFunction}
                selectRow={selectRow}
            />
        );
    }
}
