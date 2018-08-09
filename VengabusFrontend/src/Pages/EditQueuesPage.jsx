import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import Select from 'react-select';
import { css } from 'emotion';

export class EditQueuesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueue: "mkdemoqueue",
            queueData: {},
            newQueueData: {}

        };


    }

    componentDidMount = () => {
        serviceBusConnection.getServiceBusService().getQueueDetails(this.state.selectedQueue)
            .then((result) => {
                this.setState({ queueData: result, newQueueData: result });
            });
    }

    updateQueue = () => {
        serviceBusConnection.getServiceBusService().updateQueue(this.state.newQueueData);
        console.log(this.state.newQueueData);
    }

    render() {
        const newQueueData = this.state.newQueueData;
        const permittedBoolValues = [{ value: true, label: 'true' }, { value: false, label: 'false' }];
        const supportOrdering = newQueueData.supportOrdering;

        const leftAlign = css`
            text-align: left;
            padding-left: 15px;
        `;
        const width20 = css`
            width: 20%;
        `;
        const hrStlye = css`
            color: black;
            background-color: black;
            height: 1px;
            width: 98%;
        `;
        const headerStyle = css`
            font-weight: bold;
            font-size: 1.6em;
        `;

        return (
            <div>
                <br />
                <p className={leftAlign + ' ' + headerStyle}>Editable Properties</p>
                <hr className={hrStlye} />
                <p className={leftAlign}>SupportsOrdering</p>
                <Select
                    className={leftAlign + ' ' + width20}
                    title="Choose a value"
                    options={permittedBoolValues}
                    value={typeof supportOrdering !== 'undefined' ? { value: supportOrdering, label: supportOrdering.toString() } : undefined}
                    onChange={(event) => {
                        this.setState({
                            newQueueData: { ...newQueueData, supportOrdering: event.value }
                        });
                    }}
                />
                <hr className={hrStlye} />
                <Button
                    onClick={this.updateQueue}
                >
                    Update
                </Button>
            </div>
        );

    }
}
