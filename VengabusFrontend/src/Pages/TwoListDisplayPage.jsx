import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { QueueList } from '../Components/QueueList';
import { TopicsList } from '../Components/TopicsList';
import { MessageList } from '../Components/MessageList';
import { css } from 'react-emotion';
//import { promptUpdate } from '../Helpers/PromptUpdate';
import { Button, Image } from 'react-bootstrap';
import { SubscriptionList } from '../Components/SubscritionList';



export class TwoListDisplayPage extends Component {
    constructor(props) {
        super(props);
        this.stateHistory = []
        this.state = {
            currentlySelected: undefined,
            queueData: undefined,
            topicData: undefined,
            subscriptionData: undefined,
            messageData: undefined,
            leftTable: "Queue",
            rightTable: "Topic"
        };
    }
    //allows update from connect button
    componentDidMount() {
        //   promptUpdate.registerForUpdatesPrompts(this.updateRetrievedData);
    }

    componentWillUnmount() {
        //  promptUpdate.registerForUpdatesPrompts(this.updateRetrievedData);
    }
    handleClose = () => {
        this.setState({
            showMessage: false
        })
    }
    handleMessegeClick = (id, body) => {
        this.setState({
            showMessage: true,
            messageId: id,
            messageBody: body
        });
    }

    saveState = (state, update) => {
        if (!(update && this.stateHistory)) {
            let history = this.stateHistory || [];
            history.push(state);
            this.stateHistory = history;
        }
    }

    handelQueueRowClick = (e, row, rowIndex) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedMessageData = serviceBusService.listMessagesFromQueue(row.name);
        const update = (this.state.rightTable === "Message");
        this.saveState(this.state, update);
        fetchedMessageData.then(result =>
            this.setState({
                messageData: result,
                currentlySelected: row.name,
                rightTable: "Message"
            })
        );

    }

    handelTopicRowClick = (e, row, rowIndex) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedSubscriptionData = serviceBusService.listSubscriptions(row.name);
        const update = (this.state.rightTable === "Subscription");
        this.saveState(this.state, update);
        fetchedSubscriptionData.then(result =>
            this.setState({
                subscriptionData: result,
                currentlySelected: row.name,
                rightTable: "Subscription",
                leftTable: "Topic"
            })
        );

    }

    handleSubscriptionRowClick = (e, row, rowIndex) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedMessageData = serviceBusService.listMessagesFromSubscription(row.name);
        const update = (this.state.rightTable === "Message");
        this.saveState(this.state, update);
        fetchedMessageData.then(result =>
            this.setState({
                messageData: result,
                currentlySelected: row.name,
                rightTable: "Message",
                leftTable: "Subscription"
            })
        );

    }
    handleBackClick = () => {

        this.setState({
            ... this.stateHistory.pop()
        });
    }

    updateRetrievedData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedQueueData = serviceBusService.listQueues();
        const fetchedTopicData = serviceBusService.listTopics();
        fetchedQueueData.then(result =>
            this.setState({ queueData: result.data })
        );
        fetchedTopicData.then(result =>
            this.setState({ topicData: result.data })
        );
    };

    render() {

        const displayStyle = css`
            width: 30%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;


        let leftBox;

        switch (this.state.leftTable) {
            case "Queue":
                leftBox = (
                    <QueueList
                        queueData={this.state.queueData}
                        clickFun={this.handelQueueRowClick}
                        CurrentSelect={this.state.currentlySelected}
                    />
                );
                break;
            case "Topic":
                leftBox = (
                    <TopicsList
                        topicData={this.state.topicData}
                        clickFun={this.handelTopicRowClick}
                        CurrentSelect={this.state.currentlySelected}
                    />
                );
                break;
            case "Subscription":
                leftBox = (
                    <SubscriptionList
                        subscriptionData={this.state.subscriptionData.data}
                        clickFun={this.handleSubscriptionRowClick}
                        CurrentSelect={this.state.currentlySelected}
                    />
                );
                break;
        }

        let rightBox;

        switch (this.state.rightTable) {
            case "Message":
                rightBox = (
                    <MessageList
                        messageData={this.state.messageData}
                    />
                );
                break;
            case "Topic":
                rightBox = (
                    <TopicsList
                        topicData={this.state.topicData}
                        clickFun={this.handelTopicRowClick}
                        CurrentSelect={this.state.currentlySelected}
                    />
                );
                break;
            case "Subscription":
                rightBox = (
                    <SubscriptionList
                        subscriptionData={this.state.subscriptionData.data}
                        clickFun={this.handleSubscriptionRowClick}
                        CurrentSelect={this.state.currentlySelected}
                    />
                );
                break;
        }

        return (
            <div>
                <Button onClick={this.updateRetrievedData}>update</Button>
                <Button onClick={this.handleBackClick}>back</Button>
                <div className={displayStyle}>
                    <h2>{this.state.leftTable}</h2>
                    {leftBox}
                </div>
                <div className={displayStyle}>
                    <h2>{this.state.rightTable}</h2>
                    {rightBox}
                </div>
            </div>
        );
    }
}

