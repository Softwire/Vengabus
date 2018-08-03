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
            rightTable: EndpointTypes.TOPIC
        };
    }

    componentDidMount() {
        serviceBusConnection.registerForUpdatesPrompts(this.loadQueueAndTopicData);

    }
    componentWillUnmount() {
        serviceBusConnection.deregisterForUpdatesPrompts(this.loadQueueAndTopicData);

    }

    handleQueueRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory = [{ name: "Home", type: undefined }, { name: row.name, type: EndpointTypes.QUEUE }];
        this.updateEndpointMessageData();
    }

    handleTopicRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory = [{ name: "Home", type: undefined }, { name: row.name, type: EndpointTypes.TOPIC }];
        this.updateTopicSubscriptionData();
    }

    handleSubscriptionRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory.push({ name: row.name, type: EndpointTypes.SUBSCRIPTION });
        this.updateEndpointMessageData();
    }


    updateAllQueueData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedQueueData = serviceBusService.listQueues();
        fetchedQueueData.then(result =>
            this.setState({
                queueData: result.data
            })
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
        const base = this.breadCrumbHistory[this.breadCrumbHistory.length - 1];
        const serviceBusService = serviceBusConnection.getServiceBusService();
        const fetchedSubscriptionData = serviceBusService.listSubscriptions(base.name);
        fetchedSubscriptionData.then(result =>
            this.setState({
                subscriptionData: result,
                rightTable: EndpointTypes.SUBSCRIPTION
            })
        );
    }

    updateEndpointMessageData = () => {
        const base = this.breadCrumbHistory[this.breadCrumbHistory.length - 1];
        const previousBase = this.breadCrumbHistory[this.breadCrumbHistory.length - 2];
        const serviceBusService = serviceBusConnection.getServiceBusService();
        let fetchedMessageData;
        if (base.type === EndpointTypes.QUEUE || undefined) {
            fetchedMessageData = serviceBusService.listQueueMessages(base.name);
        } else {
            fetchedMessageData = serviceBusService.listSubscriptionMessages(previousBase.name, base.name);
        }
        fetchedMessageData.then((result) => {
            this.setState({
                messageData: result.data,
                rightTable: EndpointTypes.MESSAGE
            });
        });
    }

    loadQueueAndTopicData = () => {
        this.updateAllTopicData();
        this.updateAllQueueData();
        this.setState({
            rightTable: EndpointTypes.TOPIC
        });
    };

    getList = (right) => {
        let type;
        const currentBase = this.breadCrumbHistory[this.breadCrumbHistory.length - 1];
        if (right) {
            type = this.state.rightTable;
        } else {
            type = currentBase.type || EndpointTypes.QUEUE;
        }
        switch (type) {
            case EndpointTypes.QUEUE:
                return (
                    <QueueList
                        queueData={this.state.queueData}
                        clickFunction={this.handleQueueRowClick}
                        currentlySelectedName={currentBase.name}
                    />
                );
            case EndpointTypes.TOPIC:
                return (
                    <TopicList
                        topicData={this.state.topicData}
                        clickFunction={this.handleTopicRowClick}
                        currentlySelectedName={currentBase.name}
                    />
                );

            case EndpointTypes.SUBSCRIPTION:
                return (
                    <SubscriptionList
                        subscriptionData={this.state.subscriptionData.data}
                        clickFunction={this.handleSubscriptionRowClick}
                        currentlySelectedName={currentBase.name}
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
                    rightTable: EndpointTypes.MESSAGE
                });
                break;
            case (EndpointTypes.TOPIC):
                this.breadCrumbHistory = this.breadCrumbHistory.slice(0, newLength + 1);
                this.updateAllTopicData();
                this.updateTopicSubscriptionData();
                this.setState({
                    rightTable: EndpointTypes.SUBSCRIPTION
                });
                break;
            case (EndpointTypes.SUBSCRIPTION):
                this.breadCrumbHistory = this.breadCrumbHistory.slice(0, newLength + 1);
                this.updateTopicSubscriptionData();
                this.updateEndpointMessageData();
                this.setState({
                    rightTable: EndpointTypes.MESSAGE
                });
                break;
            default:
                this.breadCrumbHistory = this.breadCrumbHistory.slice(0, newLength + 1);
                this.updateRetrievedData();
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
                    <Breadcrumb.Item onClick={() => this.HandleBreadCrumbClick(this.breadCrumbHistory[i].type,i)} >
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
                    <Button onClick={this.updateRetrievedData}>update</Button>
                    <div className={displayStyle}>
                        <h2>{typeToTitle(leftType)}</h2>
                        {leftBox}
                    </div>
                    <div className={displayStyle}>
                        <h2>{typeToTitle(this.state.rightTable)}</h2>
                        {rightBox}
                    </div>
                </div>
            </div>
        );
    }
}

