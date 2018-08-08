import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';
import moment from 'moment';

export class SubscriptionList extends Component {

    render() {

        let subscriptionArray = undefined;
        if (this.props.subscriptionData) {
            subscriptionArray = [...this.props.subscriptionData];

            for (let i = 0; i < subscriptionArray.length; i++) {
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
                headerStyle: { width: '25%', textAlign: 'center' }
            },
            {
                dataField: 'activeMessageCount',
                text: 'active Message Count',
                headerStyle: { width: '25%', textAlign: 'center' }
            },
            {
                dataField: 'deadletterMessageCount',
                text: 'dead Message Count',
                headerStyle: { width: '25%', textAlign: 'center' }
            }, {
                dataField: 'mostRecentDeadLetter',
                text: 'most Recent Deadletter',
                headerStyle: { width: '25%', textAlign: 'center' }
            }
        ];

        const tableRowStyle = css`
		          :hover {
		              border: 1px solid ${palerBlue};
		              background-color: ${paleGreyBlue};
		          }
              `;

        return (
            <DataTable
                name='subscriptionList'
                colProps={colProps}
                dataToDisplay={subscriptionArray}
                tableRowStyle={tableRowStyle}
                onRowClick={this.props.clickFunction}
                rowSelect={this.props.currentlySelectedName}
            />
        );
    }
}
