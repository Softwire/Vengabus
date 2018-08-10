import React, { Component } from 'react';
import { Button, Checkbox } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import Select from 'react-select';
import { css } from 'emotion';
import classNames from 'classnames';
import { DataTable } from '../Components/DataTable';

export class EditQueuesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueue: "mkdemoqueue",
            queueData: {},
            newQueueData: {},
            receivedData: false
        };


    }

    componentDidMount = () => {
        serviceBusConnection.getServiceBusService().getQueueDetails(this.state.selectedQueue)
            .then((result) => {
                this.setState({ queueData: result, newQueueData: result, receivedData: true });
            });
    }

    assembleReadOnlyProperties = (properties) => {
        let readOnlyProperties = [];
        const keys = Object.keys(properties);
        for (let i = 0; i < keys.length; i++) {
            readOnlyProperties.push({
                name: keys[i],
                value: properties[keys[i]]
            });
        }
        return readOnlyProperties;
    }

    updateQueue = () => {
        serviceBusConnection.getServiceBusService().updateQueue(this.state.newQueueData);
        console.log(this.state.newQueueData);
    }

    render() {
        const newQueueData = this.state.newQueueData;
        const { name, activeMessageCount, deadletterMessageCount, mostRecentDeadLetter, enablePartitioning, requiresSession, supportOrdering } = newQueueData;

        const readOnlyProperties = this.assembleReadOnlyProperties(
            {   // text in the left column: value in the right column
                "Name": name,
                "Active Message Count": activeMessageCount,
                "Dead Letter Message Count": deadletterMessageCount,
                "Most Recent Dead Letter": mostRecentDeadLetter
            });
        const colProps = [{ dataField: 'name', text: 'Property Name', headerStyle: { textAlign: 'left' } }, { dataField: 'value', headerStyle: { textAlign: 'left' } }];

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
            this.state.receivedData ? (
                <div>
                    <br />

                    <p className={classNames(leftAlign, headerStyle)}>Read-Only Properties</p>
                    <hr className={hrStlye} />
                    <div className={css`width: 98%; padding-left: 20px`} >
                        <DataTable
                            dataToDisplay={readOnlyProperties}
                            uniqueKeyColumn='name'
                            colProps={colProps}
                            rowClasses={css`text-align: left`}
                            bordered={false}
                        />
                    </div>

                    <p className={classNames(leftAlign, headerStyle)}>Editable Properties</p>
                    <hr className={hrStlye} />
                    <p className={leftAlign}>SupportsOrdering</p>
                    {/* <Select
                    className={classNames(leftAlign, width20)}
                    title="Choose a value"
                    options={permittedBoolValues}
                    value={typeof supportOrdering !== 'undefined' ? { value: supportOrdering, label: supportOrdering.toString() } : undefined}
                    onChange={(event) => {
                        this.setState({
                            newQueueData: { ...newQueueData, supportOrdering: event.value }
                        });
                    }}
                /> */}
                    <Checkbox
                        className={leftAlign}
                        checked={supportOrdering}
                        onChange={(event) => {
                            this.setState({
                                newQueueData: { ...newQueueData, supportOrdering: event.target.checked }
                            });
                        }}
                    />
                    <hr className={hrStlye} />
                    <p className={leftAlign}>RequiresSession</p>
                    <Checkbox
                        className={leftAlign}
                        checked={requiresSession}
                        onChange={(event) => {
                            this.setState({
                                newQueueData: { ...newQueueData, requiresSession: event.target.checked }
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
            ) : (
                    <p>Fetching data</p>
                )
        );

    }
}
