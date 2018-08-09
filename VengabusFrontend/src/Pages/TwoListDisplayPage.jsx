import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { QueueList } from '../Components/QueueList';
import { TopicList } from '../Components/TopicList';
import { MessageList } from '../Components/MessageList';
import { css } from 'react-emotion';
import { Breadcrumb, Button } from 'react-bootstrap';
import { SubscriptionList } from '../Components/SubscriptionList';
import { EndpointTypes, typeToTitle } from '../Helpers/EndpointTypes';


export class TwoListDisplayPage extends Component {
    constructor(props) {
        super(props);
        this.displayHistory = [];
        this.breadCrumbHistory = [{ name: "Home", type: undefined }];
        this.state = {
            queueData: undefined,
            topicData: undefined,
            subscriptionData: undefined,
            messageData: undefined,
            rightTableType: EndpointTypes.TOPIC
        };
    }

    componentDidMount() {
        serviceBusConnection.registerForUpdatesPrompts(this.resetInitialStateData);

    }
    componentWillUnmount() {
        serviceBusConnection.deregisterForUpdatesPrompts(this.resetInitialStateData);

    }

    handleQueueRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory = [{ name: "Home", type: undefined }, { name: row.name, type: EndpointTypes.QUEUE }];
        this.updateEndpointMessageData();
        this.setState({
            rightTableType: EndpointTypes.MESSAGE
        });
    }

    handleTopicRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory = [{ name: "Home", type: undefined }, { name: row.name, type: EndpointTypes.TOPIC }];
        this.updateTopicSubscriptionData();
        this.setState({
            rightTableType: EndpointTypes.SUBSCRIPTION
        });
    }

    handleSubscriptionRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory[2] = { name: row.name, type: EndpointTypes.SUBSCRIPTION };
        this.updateEndpointMessageData();
        this.setState({
            rightTableType: EndpointTypes.MESSAGE
        });
    }

    handleDeadLetterClick = (e) => {
        this.updateEndpointDeadLetterData();
        this.setState({
            rightTableType: EndpointTypes.DEADLETTER
        });
    }

    handleNormalMessageClick = (e) => {
        this.updateEndpointMessageData();
        this.setState({
            rightTableType: EndpointTypes.MESSAGE
        });
    }
    updateAllQueueData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedQueueData = serviceBusService.listQueues();
        fetchedQueueData.then(result => {
            this.setState({
                queueData: result
            });
        });
    }

    updateAllTopicData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedTopicData = serviceBusService.listTopics();
        fetchedTopicData.then(result => {
            this.setState({
                topicData: result
            });
        });
    }

    updateTopicSubscriptionData = () => {
        const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedSubscriptionData = serviceBusService.listSubscriptions(topicName);
        fetchedSubscriptionData.then(result => {
            this.setState({
                subscriptionData: result
            });
        });
    }

    updateEndpointMessageData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        let fetchedMessageData;
        const leftTableType = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].type;
        if (leftTableType === EndpointTypes.QUEUE || typeof leftTableType === 'undefined') {
            const queueName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            fetchedMessageData = serviceBusService.listQueueMessages(queueName);
        } else {
            const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 2].name;
            const subscriptionName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            fetchedMessageData = serviceBusService.listSubscriptionMessages(topicName, subscriptionName);
        }
        fetchedMessageData.then((result) => {
            this.setState({
                messageData: result
            });
        });
    }
    updateEndpointDeadLetterData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        let fetchedDeadLetterData;
        const leftTableType = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].type;
        if (leftTableType === EndpointTypes.QUEUE || typeof leftTableType === 'undefined') {
            const queueName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            fetchedDeadLetterData = serviceBusService.listQueueDeadLetterMessages(queueName);

        } else {
            const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 2].name;
            const subscriptionName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            fetchedDeadLetterData = serviceBusService.listSubscriptionDeadLetterMessages(topicName, subscriptionName);
        }
        fetchedDeadLetterData.then((result) => {
            this.setState({
                messageData: result
            });
        });
    }

    resetInitialStateData = () => {
        this.updateAllTopicData();
        this.updateAllQueueData();
        this.breadCrumbHistory = [{ name: "Home", type: undefined }];
        this.setState({
            rightTableType: EndpointTypes.TOPIC
        });
    };

    getList = (isForRightHandList) => {
        let typeOfData;
        const currentLeftTable = this.breadCrumbHistory[this.breadCrumbHistory.length - 1];
        let currentSelection;
        if (isForRightHandList) {
            typeOfData = this.state.rightTableType;
        } else {
            //if there is no history the currentLeftTable will be undefined
            //if its undefined its undefined then its the original state and therefore should be queue
            typeOfData = currentLeftTable.type || EndpointTypes.QUEUE;
            currentSelection = currentLeftTable.name;
        }
        const displayStyle = css`
                    display: inline-block;
                    margin:10px;
                `;
        switch (typeOfData) {
            case EndpointTypes.QUEUE:
                return (
                    <div>
                        <h2>{typeToTitle(EndpointTypes.QUEUE)}</h2>
                        <QueueList
                            queueData={this.state.queueData}
                            clickFunction={this.handleQueueRowClick}
                            currentlySelectedName={currentSelection}
                        />
                    </div>
                );
            case EndpointTypes.TOPIC:
                return (
                    <div>
                        <h2>{typeToTitle(EndpointTypes.TOPIC)}</h2>
                        <TopicList
                            topicData={this.state.topicData}
                            clickFunction={this.handleTopicRowClick}
                            currentlySelectedName={currentSelection}
                        />
                    </div>
                );

            case EndpointTypes.SUBSCRIPTION:
                return (
                    <div>
                        <h2>{typeToTitle(EndpointTypes.SUBSCRIPTION)}</h2>
                        <SubscriptionList
                            subscriptionData={this.state.subscriptionData}
                            clickFunction={this.handleSubscriptionRowClick}
                            currentlySelectedName={currentSelection}
                        />
                    </div>
                );
            case EndpointTypes.MESSAGE:

                return (
                    <div>
                        <div >
                            <h2 className={displayStyle} >{typeToTitle(EndpointTypes.MESSAGE)}</h2>
                            <Button className={displayStyle} onClick={this.handleDeadLetterClick}> DeadLetter </Button>
                        </div>
                        <MessageList
                            messageData={this.state.messageData}
                        />
                    </div>

                );
            case EndpointTypes.DEADLETTER:
                return (
                    <div>
                        <div>
                            <h2 className={displayStyle} >{typeToTitle(EndpointTypes.DEADLETTER)}</h2>
                            <Button className={displayStyle} onClick={this.handleNormalMessageClick} > normal </Button>
                        </div>
                        <MessageList
                            messageData={this.state.messageData}
                        />
                    </div>

                );
            default:
                throw new Error('Invalid endpoint type.');
        }
    }

    HandleBreadCrumbClick = (type, newLength) => {
        switch (type) {
            case (EndpointTypes.QUEUE):
                this.breadCrumbHistory = this.breadCrumbHistory.slice(0, newLength + 1);
                this.updateAllQueueData();
                this.updateEndpointMessageData();
                this.setState({
                    rightTableType: EndpointTypes.MESSAGE
                });
                break;
            case (EndpointTypes.TOPIC):
                this.breadCrumbHistory = this.breadCrumbHistory.slice(0, newLength + 1);
                this.updateAllTopicData();
                this.updateTopicSubscriptionData();
                this.setState({
                    rightTableType: EndpointTypes.SUBSCRIPTION
                });
                break;
            case (EndpointTypes.SUBSCRIPTION):
                this.breadCrumbHistory = this.breadCrumbHistory.slice(0, newLength + 1);
                this.updateTopicSubscriptionData();
                this.updateEndpointMessageData();
                this.setState({
                    rightTableType: EndpointTypes.MESSAGE
                });
                break;
            default:
                this.breadCrumbHistory = this.breadCrumbHistory.slice(0, newLength + 1);
                this.resetInitialStateData();
                break;
        }

    }


    getBreadcrumbElement = () => {
        const breadcrumbStyle = css`
            float: left;
            height:35px;
            margin-bottom: 1px !important;
        `;

        const breadcrumbItems = this.breadCrumbHistory.map((breadCrumb, i) => {
            return (<Breadcrumb.Item onClick={() => this.HandleBreadCrumbClick(breadCrumb.type, i)} active={(i === this.breadCrumbHistory.length - 1)} key={i}>
                {this.breadCrumbHistory[i].name}
            </Breadcrumb.Item>);
        });

        return (
            <Breadcrumb className={breadcrumbStyle}>
                {breadcrumbItems}
            </Breadcrumb>
        );
    }

    render() {

        const displayStyle = css`
            width: 40%;
            margin-left: 10px;
            margin-right:10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;
        const outerDivDisplay = css`
            display: block;
            `;

        const breadCrumbDisplay = css`
            display: block;
            height:35px;
            margin:2px;
            `;


        const leftBox = this.getList();
        const rightBox = this.getList(true);
        const rightType = this.state.rightTableType;
        const leftType = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].type || EndpointTypes.QUEUE;

        return (
            <div >
                <div className={breadCrumbDisplay} >
                    {this.getBreadcrumbElement()}
                </div>
                <div className={outerDivDisplay}>
                    <div className={displayStyle}>
                        {leftBox}
                    </div>
                    <div className={displayStyle}>
                        {rightBox}
                    </div>
                </div>
            </div>
        );
    }
}

