import React, { Component } from 'react';
import { DataTable } from './DataTable';
import { css } from 'react-emotion';
import { paleGreyBlue, palerBlue } from '../colourScheme';

export class SubscriptionList extends Component {

    render() {

        const subscriptionArray = this.props.subscriptionData;
       
        const colProps = [
            {
                dataField: 'name',
                text: 'Name',
                headerStyle: { width: '30%', textAlign: 'center' }
            },
            {
                dataField: 'activeMessageCount',
                text: 'active Message Count',
                headerStyle: { width: '30%', textAlign: 'center' }
            },
            {
                dataField: 'deadletterMessageCount',
                text: 'dead Message Count',
                headerStyle: { width: '30%', textAlign: 'center' }
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
                onRowClick={this.props.clickFun}
                rowSelect={this.props.CurrentSelect}
            />
        );
    }
}
