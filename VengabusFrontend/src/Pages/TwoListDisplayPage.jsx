import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { QueueList } from '../Components/QueueList';
import { TopicList } from '../Components/TopicList';
import { MessageList } from '../Components/MessageList';
import { css } from 'react-emotion';
import { Button, Image } from 'react-bootstrap';
import { SubscriptionList } from '../Components/SubscriptionList';
import { EndpointTypes, typeToTitle } from '../Helpers/EndpointTypes';



export class TwoListDisplayPage extends Component {
    constructor(props) {
        super(props);
        this.displayHistory = [];
        this.state = {
            queueData: undefined,
            topicData: undefined,
            subscriptionData: undefined,
            messageData: undefined,
            display: {
                leftTable: EndpointTypes.QUEUE,
                rightTable: EndpointTypes.TOPIC,
                currentlySelected: undefined
            }
        };
    }

    handleQueueRowClick = (e, row, rowIndex) => {
        const newDisplay = {
            leftTable: EndpointTypes.QUEUE,
            rightTable: EndpointTypes.MESSAGE,
            currentlySelected: row.name
        };
        this.pushToDisplayHistory(newDisplay);
        this.updateDisplay(newDisplay);
    }

    handleTopicRowClick = (e, row, rowIndex) => {
        const newDisplay = {
            leftTable: EndpointTypes.TOPIC,
            rightTable: EndpointTypes.SUBSCRIPTION,
            currentlySelected: row.name
        };
        this.pushToDisplayHistory(newDisplay);
        this.updateDisplay(newDisplay);

    }

    handleSubscriptionRowClick = (e, row, rowIndex) => {
        const newDisplay = {
            leftTable: EndpointTypes.SUBSCRIPTION,
            rightTable: EndpointTypes.MESSAGE,
            currentlySelected: row.name
        };
        this.pushToDisplayHistory(newDisplay);
        this.updateDisplay(newDisplay);
    }

    handleBackClick = () => {
        const peekMostRecent = this.displayHistory[this.displayHistory.length - 1];
        if (peekMostRecent) {
            this.updateDisplay(this.displayHistory.pop(), true);
        }
    }

    pushToDisplayHistory = (newDisplay) => {
        const currentDisplay = this.state.display;
        const bothSidesUnchanged = (currentDisplay.leftTable === newDisplay.leftTable && currentDisplay.rightTable === newDisplay.rightTable);
        if (!bothSidesUnchanged) {
            this.displayHistory.push(currentDisplay);
        }
    }

    updateDisplay = (newDisplay, isBackStep) => {
        //when moving "forward" the right column always contains fresh data and the left contains old data
        //when moving "backward" this is reversed
        const currentDisplay = this.state.display;

        const dataToFetch = isBackStep ? newDisplay.leftTable : newDisplay.rightTable;

        switch (dataToFetch) {
            case EndpointTypes.MESSAGE:
                this.updateEndpointMessageData(newDisplay, currentDisplay.currentlySelected);
                break;
            case EndpointTypes.SUBSCRIPTION:
                this.updateTopicSubscriptionData(newDisplay);
                break;
            case EndpointTypes.QUEUE:
                this.updateAllQueueData(newDisplay);
                break;
            case EndpointTypes.TOPIC:
                this.updateAllTopicData(newDisplay);
                break;
        }
    }

    updateAllQueueData = (newDisplay) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedQueueData = serviceBusService.listQueues();
        fetchedQueueData.then(result =>
            this.setState({
                queueData: result.data,
                display: newDisplay
            })
        );
    }

    updateAllTopicData = (newDisplay) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedTopicData = serviceBusService.listTopics();
        fetchedTopicData.then(result =>
            this.setState({
                topicData: result.data,
                display: newDisplay
            })
        );
    }

    updateTopicSubscriptionData = (newDisplay) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const selectedTopicName = newDisplay.currentlySelected;
        const fetchedSubscriptionData = serviceBusService.listSubscriptions(selectedTopicName);
        fetchedSubscriptionData.then(result =>
            this.setState({
                subscriptionData: result,
                display: newDisplay
            })
        );
    }

    updateEndpointMessageData = (newDisplay, parentTopicIfIsSubscription) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        let fetchedMessageData;
        if (newDisplay.leftTable === EndpointTypes.QUEUE) {
            fetchedMessageData = serviceBusService.listQueueMessages(newDisplay.currentlySelected);
        } else {
            fetchedMessageData = serviceBusService.listSubscriptionMessages(parentTopicIfIsSubscription, newDisplay.currentlySelected);
        }
        fetchedMessageData.then((result) => {
            this.setState({
                messageData: result.data,
                display: newDisplay
            });
        });
    }

    updateRetrievedData = () => {
        const display = {
            leftTable: EndpointTypes.QUEUE,
            rightTable: EndpointTypes.TOPIC,
            currentlySelected: undefined
        };
        this.updateAllQueueData(display);
        this.updateAllTopicData(display);
    };

    getList = (type, currentlySelected) => {
        switch (type) {
            case EndpointTypes.QUEUE:
                return (
                    <QueueList
                        queueData={this.state.queueData}
                        clickFunction={this.handleQueueRowClick}
                        currentlySelectedName={currentlySelected}
                    />
                );
            case EndpointTypes.TOPIC:
                return (
                    <TopicList
                        topicData={this.state.topicData}
                        clickFunction={this.handleTopicRowClick}
                        currentlySelectedName={currentlySelected}
                    />
                );

            case EndpointTypes.SUBSCRIPTION:
                return (
                    <SubscriptionList
                        subscriptionData={this.state.subscriptionData.data}
                        clickFunction={this.handleSubscriptionRowClick}
                        currentlySelectedName={currentlySelected}
                    />
                );
            case EndpointTypes.MESSAGE:
                return (
                    <MessageList
                        messageData={this.state.messageData}
                    />
                );

        }
    }


    render() {
        //QQ change width when side buttons are removed
        const displayStyle = css`
            width: 35%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;


        const leftBox = this.getList(this.state.display.leftTable, this.state.display.currentlySelected);


        const rightBox = this.getList(this.state.display.rightTable);


        return (
            <div>
                <Button onClick={this.updateRetrievedData}>update</Button>
                <Button onClick={this.handleBackClick}>back</Button>
                <div className={displayStyle}>
                    <h2>{typeToTitle(this.state.display.leftTable)}</h2>
                    {leftBox}
                </div>
                <div className={displayStyle}>
                    <h2>{typeToTitle(this.state.display.rightTable)}</h2>
                    {rightBox}
                </div>
            </div>
        );
    }
}

