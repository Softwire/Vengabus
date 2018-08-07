import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import Select from 'react-select';

export class EditQueuesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedQueue: "demoqueue1"
        };
    }

    render() {
        let queueData = serviceBusConnection.getServiceBusService().getQueueDetails(this.state.selectedQueue);
        const permittedValues = [{ value: true, label: 'true' }, { value: false, label: 'false' }];
        const supportOrdering = queueData.supportOrdering;

        return (
            <div>
                <p>SupportOrdering</p>
                <Select
                    title="Choose a value"
                    options={permittedValues}
                    value={supportOrdering ? { value: supportOrdering, label: supportOrdering.toString() } : undefined}
                    onChange={(event) => console.log(event.value)}
                />
            </div>
        );
    }
}
