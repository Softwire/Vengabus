import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { QueueList } from '../Components/QueueList';
import { TopicList } from '../Components/TopicList';
import { MessageList } from '../Components/MessageList';
import { css, injectGlobal } from 'react-emotion';
import { Button, Breadcrumb } from 'react-bootstrap';
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


    updateAllQueueData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedQueueData = serviceBusService.listQueues();
        fetchedQueueData.then(result => {
            this.setState({
                queueData: result.data
            });
        }
        );
    }

    updateAllTopicData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedTopicData = serviceBusService.listTopics();
        fetchedTopicData.then(result =>
            this.setState({
                topicData: result.data
            })
        );
    }

    updateTopicSubscriptionData = () => {
        const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedSubscriptionData = serviceBusService.listSubscriptions(topicName);
        fetchedSubscriptionData.then(result => {
            this.setState({
                subscriptionData: result.data
            })
        }
        );
    }

    updateEndpointMessageData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        let fetchedMessageData;
        const leftTableType = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].type;
        if (leftTableType === EndpointTypes.QUEUE || leftTableType === undefined) {
            const queueName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            fetchedMessageData = serviceBusService.listQueueMessages(queueName);
        } else {
            const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 2].name;
            const subscriptionName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            fetchedMessageData = serviceBusService.listSubscriptionMessages(topicName, subscriptionName);
        }
        fetchedMessageData.then((result) => {
            this.setState({
                messageData: result.data
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
        if (isForRightHandList) {
            typeOfData = this.state.rightTableType;
        } else {
            //if there is no history the currentLEftTable will be underfiend 
            //if its underfined its underfiend then its the orignal state and therefore should be queue
            typeOfData = currentLeftTable.type || EndpointTypes.QUEUE;
        }
        switch (typeOfData) {
            case EndpointTypes.QUEUE:
                return (
                    <QueueList
                        queueData={this.state.queueData}
                        clickFunction={this.handleQueueRowClick}
                        currentlySelectedName={currentLeftTable.name}
                    />
                );
            case EndpointTypes.TOPIC:
                return (
                    <TopicList
                        topicData={this.state.topicData}
                        clickFunction={this.handleTopicRowClick}
                        currentlySelectedName={currentLeftTable.name}
                    />
                );

            case EndpointTypes.SUBSCRIPTION:
                return (
                    <SubscriptionList
                        subscriptionData={this.state.subscriptionData}
                        clickFunction={this.handleSubscriptionRowClick}
                        currentlySelectedName={currentLeftTable.name}
                    />
                );
            case EndpointTypes.MESSAGE:
                return (
                    <MessageList
                        messageData={this.state.messageData}
                    />
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
            height:2px;
            margin:2px;
        `;

        const breadcrumbItems = [];
        for (let i = 0; i < this.breadCrumbHistory.length; i++) {
            if (i === this.breadCrumbHistory.length - 1) {
                breadcrumbItems.push(
                    <Breadcrumb.Item onClick={() => this.HandleBreadCrumbClick(this.breadCrumbHistory[i].type, i)} active >
                        {this.breadCrumbHistory[i].name}
                    </Breadcrumb.Item>
                );
            } else {
                breadcrumbItems.push(
                    <Breadcrumb.Item onClick={() => this.HandleBreadCrumbClick(this.breadCrumbHistory[i].type, i)} >
                        {this.breadCrumbHistory[i].name}
                    </Breadcrumb.Item>
                );
            }
        }
        return (
            <Breadcrumb className={breadcrumbStyle} >
                {breadcrumbItems}
            </Breadcrumb>
        );
    }

    render() {
        //QQ change width when side buttons are removed
        const displayStyle = css`
            width: 30%;
            margin-left: 10px;
            margin-right:10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;
        const outerDivDisplay = css`
            display: block;
            `;

        const breadCrumbDisplay = css`
            display: block;
            height:40px;
            margin:2px;
            `;


        const leftBox = this.getList();
        const rightBox = this.getList(true);
        const leftType = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].type || EndpointTypes.QUEUE;

        return (
            <div >
                <div className={breadCrumbDisplay} >
                    {this.getBreadcrumbElement()}
                </div>
                <div className={outerDivDisplay}>
                    <div className={displayStyle}>
                        <h2>{typeToTitle(leftType)}</h2>
                        {leftBox}
                    </div>
                    <div className={displayStyle}>
                        <h2>{typeToTitle(this.state.rightTableType)}</h2>
                        {rightBox}
                    </div>
                </div>
            </div>
        );
    }
}

