import React, { Component } from 'react';
import { DataTable } from '../DataTable';
import { formatTimeStamp } from '../../Helpers/FormattingHelpers';
import { palerBlue } from '../../colourScheme';
import { Button } from 'react-bootstrap';
import { pageSwitcher, PAGES } from '../../Pages/PageSwitcherService';
import { EndpointTypes } from '../../Helpers/EndpointTypes';

export class SubscriptionList extends Component {

    render() {

        let subscriptionArray = undefined;
        if (this.props.subscriptionData) {
            subscriptionArray = [...this.props.subscriptionData];

            for (let i = 0; i < subscriptionArray.length; i++) {
                //needs to be cloned
                subscriptionArray[i] = { ...subscriptionArray[i] };
                const currentMessageArray = subscriptionArray[i];
                if (currentMessageArray.mostRecentDeadLetter && currentMessageArray.mostRecentDeadLetterLoaded) {
                    currentMessageArray.mostRecentDeadLetter = formatTimeStamp(currentMessageArray.mostRecentDeadLetter);
                }
                subscriptionArray[i].formatterId = i;
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
                dataField: 'formatterId',
                text: ' ',
                width: 8,
                formatter: (cell, row, rowIndex) => {
                    return (
                        <Button bsSize='xsmall' onClick={() => pageSwitcher.switchToPage(PAGES.CrudPage, { endpointType: EndpointTypes.SUBSCRIPTION, selectedEndpoint: row.name, parentTopic: row.topicName })} >
                            edit
                        </Button>
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
