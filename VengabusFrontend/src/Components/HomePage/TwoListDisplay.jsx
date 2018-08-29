import React, { Component } from 'react';
import { serviceBusConnection } from '../../AzureWrappers/ServiceBusConnection';
import { QueueList } from './QueueList';
import { TopicList } from './TopicList';
import { MessageList } from './MessageList';
import { css } from 'react-emotion';
import { Breadcrumb, Tabs, Tab } from 'react-bootstrap';
import { SubscriptionList } from './SubscriptionList';
import { EndpointTypes, typeToTitle } from '../../Helpers/EndpointTypes';
import { sharedSizesAndDimensions } from '../../Helpers/SharedSizesAndDimensions';
import { cancellablePromiseCollection } from '../../Helpers/CancellablePromiseCollection';

const messageCount = 500;

export class TwoListDisplay extends Component {
    constructor(props) {
        super(props);
        this.displayHistory = [];
        this.breadCrumbHistory = [{ name: "Home", type: undefined }];
        this.messageButtonDisabled = false;
        this.promiseCollection = new cancellablePromiseCollection();
        this.messageTabType = EndpointTypes.MESSAGE;
        this.state = {
            queueData: null,
            topicData: null,
            subscriptionData: null,
            messageData: null,
            rightTableType: EndpointTypes.TOPIC
        };
    }

    componentDidMount() {
        serviceBusConnection.registerForUpdatesPrompts(this.resetInitialStateData);
        if (serviceBusConnection.connected) {
            serviceBusConnection.promptUpdate();
        }

    }
    componentWillUnmount() {
        serviceBusConnection.deregisterForUpdatesPrompts(this.resetInitialStateData);
        this.promiseCollection.cancelAllPromises();

    }

    handleQueueRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory = [{ name: "Home", type: undefined }, { name: row.name, type: EndpointTypes.QUEUE }];
        this.messageButtonDisabled = true;
        this.setState({
            messageData: undefined,
            rightTableType: this.messageTabType
        }, () => this.updateEndpointMessageData(this.messageTabType));
    }

    handleTopicRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory = [{ name: "Home", type: undefined }, { name: row.name, type: EndpointTypes.TOPIC }];
        this.setState({
            subscriptionData: undefined,
            rightTableType: EndpointTypes.SUBSCRIPTION
        }, this.updateTopicSubscriptionData);
    }

    handleSubscriptionRowClick = (e, row, rowIndex) => {
        this.breadCrumbHistory[2] = { name: row.name, type: EndpointTypes.SUBSCRIPTION };
        this.messageButtonDisabled = true;
        this.setState({
            messageData: undefined,
            rightTableType: this.messageTabType
        }, () => this.updateEndpointMessageData(this.messageTabType));
    }

    handleMessageToggle = (MessageType) => {
        this.messageButtonDisabled = true;
        this.messageTabType = MessageType;
        this.setState({
            messageData: undefined,
            rightTableType: MessageType
        }, () => this.updateEndpointMessageData(this.messageTabType));
    }

    updateAllQueueData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        this.promiseCollection.cancelAllPromises(EndpointTypes.QUEUE);
        const fetchedQueueData = this.promiseCollection.addNewPromise(serviceBusService.listQueues(), EndpointTypes.QUEUE);
        fetchedQueueData.then((result) => {
            this.setState({
                queueData: result.map((item) => ({ ...item, mostRecentDeadLetter: null }))
            });
            for (let i = 0; i < result.length; i++) {
                const getMostRecentDLPromise = this.promiseCollection.addNewPromise(serviceBusService.getQueueMostRecentDeadletter(result[i].name), EndpointTypes.QUEUE);
                this.setState(function (prevState, props) {
                    prevState.queueData[i].mostRecentDeadLetter = 'Loading';//qq use spinner later
                    prevState.queueData[i].mostRecentDeadLetterLoaded = false;
                    return prevState;
                });
                getMostRecentDLPromise.then((timeStamp) => {
                    this.setState(function (prevState, props) {
                        prevState.queueData[i].mostRecentDeadLetter = timeStamp;
                        prevState.queueData[i].mostRecentDeadLetterLoaded = true;
                        return prevState;
                    });
                }).catch((e) => { });
            }
        }).catch((e) => {
            if (!e.isCanceled) {
                this.setState({
                    queueData: []
                });
            }
        });
    }

    updateAllTopicData = () => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        this.promiseCollection.cancelAllPromises(EndpointTypes.TOPIC);
        const fetchedTopicData = this.promiseCollection.addNewPromise(serviceBusService.listTopics(), EndpointTypes.TOPIC);
        fetchedTopicData.then(result => {
            this.setState({
                topicData: result
            });
        }).catch(e => {
            if (!e.isCanceled) {
                this.setState({
                    topicData: []
                });
            }
        });
    }

    updateTopicSubscriptionData = () => {
        const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
        const serviceBusService = serviceBusConnection.getServiceBusService();
        this.promiseCollection.cancelAllPromises(EndpointTypes.SUBSCRIPTION);
        const fetchedSubscriptionData = this.promiseCollection.addNewPromise(serviceBusService.listSubscriptions(topicName), EndpointTypes.SUBSCRIPTION);
        fetchedSubscriptionData.then(result => {
            this.setState(function (prevState, props) {
                for (let i = 0; i < result.length; i++) {
                    result[i].mostRecentDeadletter = 'Loading';
                    result[i].mostRecentDeadletterLoaded = false;
                }
                prevState.subscriptionData = result;
                return prevState;
            });
            for (let i = 0; i < result.length; i++) {
                const getMostRecentDLPromise = this.promiseCollection.addNewPromise(serviceBusService.getSubscriptionMostRecentDeadletter(topicName, result[i].name), EndpointTypes.SUBSCRIPTION);
                getMostRecentDLPromise.then((timeStamp) => {
                    this.setState(function (prevState, props) {
                        prevState.subscriptionData[i].mostRecentDeadLetter = timeStamp;
                        prevState.subscriptionData[i].mostRecentDeadLetterLoaded = true;
                        return prevState;
                    });
                }).catch((e) => { });
            }
        }).catch(e => {
            if (!e.isCanceled) {
                this.setState({
                    subscriptionData: []
                });
            }
        });
    }


    updateEndpointMessageData = (messageType) => {
        const isMessageDeadletters = messageType === EndpointTypes.DEADLETTER;
        const serviceBusService = serviceBusConnection.getServiceBusService();
        let fetchedMessageData;
        const leftTableType = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].type;
        if (leftTableType === EndpointTypes.QUEUE || typeof leftTableType === 'undefined') {
            const queueName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            if (isMessageDeadletters) {
                fetchedMessageData = serviceBusService.listQueueDeadLetterMessages(queueName, messageCount);
            } else {
                fetchedMessageData = serviceBusService.listQueueMessages(queueName, messageCount);
            }
        } else {
            const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 2].name;
            const subscriptionName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            if (isMessageDeadletters) {
                fetchedMessageData = serviceBusService.listSubscriptionDeadLetterMessages(topicName, subscriptionName, messageCount);
            } else {
                fetchedMessageData = serviceBusService.listSubscriptionMessages(topicName, subscriptionName, messageCount);
            }
        }
        this.promiseCollection.cancelAllPromises(EndpointTypes.MESSAGE);
        const wrappedFetchedMessageData = this.promiseCollection.addNewPromise(fetchedMessageData, EndpointTypes.MESSAGE);
        wrappedFetchedMessageData.then((result) => {
            this.messageButtonDisabled = false;
            this.setState({
                messageData: result
            });
        }).catch(e => {
            if (!e.isCanceled) {
                this.setState({
                    messageData: []
                });
            }
        });
    }

    resetInitialStateData = () => {
        this.setState({
            queueData: undefined,
            topicData: undefined
        });
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
        const minHeightOfHeader = {
            "minHeight": "92px",
            "height": "92px"
        };

        const cssForTabs = css`
        li{
            text-align: center;
            width:50%;
        }
        `;


        switch (typeOfData) {
            case EndpointTypes.QUEUE:
                return (
                    <React.Fragment>
                        <div>
                            <h2 id='title'>{typeToTitle(EndpointTypes.QUEUE)}</h2>
                        </div>
                        <QueueList
                            queueData={this.state.queueData}
                            clickFunction={this.handleQueueRowClick}
                            currentlySelectedName={currentSelection}
                            id='QueueTable'
                            headerStyle={minHeightOfHeader}
                        />
                    </React.Fragment>
                );
            case EndpointTypes.TOPIC:
                return (
                    <React.Fragment>
                        <div>
                            <h2 id='title'>{typeToTitle(EndpointTypes.TOPIC)}</h2>
                        </div>
                        <TopicList
                            topicData={this.state.topicData}
                            clickFunction={this.handleTopicRowClick}
                            currentlySelectedName={currentSelection}
                            id='TopicTable'
                            headerStyle={minHeightOfHeader}
                        />
                    </React.Fragment>
                );

            case EndpointTypes.SUBSCRIPTION:
                return (
                    <React.Fragment>
                        <div>
                            <h2 id='title' >{typeToTitle(EndpointTypes.SUBSCRIPTION)}</h2>
                        </div>
                        <SubscriptionList
                            subscriptionData={this.state.subscriptionData}
                            clickFunction={this.handleSubscriptionRowClick}
                            currentlySelectedName={currentSelection}
                            id='SubscriptionTable'
                            headerStyle={minHeightOfHeader}
                        />
                    </React.Fragment>
                );
            case EndpointTypes.MESSAGE:
            case EndpointTypes.DEADLETTER:
                const lastBreadCrumb = this.breadCrumbHistory[this.breadCrumbHistory.length - 1];
                const penultimateBreadCrumb = this.breadCrumbHistory[this.breadCrumbHistory.length - 2];
                return (
                    <React.Fragment>
                        <div className={cssForTabs}>
                            <Tabs defaultActiveKey={this.messageTabType} id="Tabs" onSelect={this.handleMessageToggle}>
                                <Tab eventKey={EndpointTypes.MESSAGE} title="Live Messages" />
                                <Tab eventKey={EndpointTypes.DEADLETTER} title="Deadletter Messages" />
                            </Tabs>
                        </div>
                        <MessageList
                            id='MessageTable'
                            messageData={this.state.messageData}
                            messageType={typeOfData}
                            endpointType={lastBreadCrumb.type}
                            endpointName={lastBreadCrumb.name}
                            endpointParent={penultimateBreadCrumb.name}
                            headerStyle={minHeightOfHeader}
                            refreshMessageTableHandler={() => {
                                this.setState({
                                    messageData: undefined
                                }, () => this.updateEndpointMessageData(this.messageTabType));

                            }}
                        />
                    </React.Fragment>

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
        const breadCrumbStyle = css`
        &.breadcrumb{
          float: left;
            height:${sharedSizesAndDimensions.BREADCRUMBS_HEIGHT}px;
            margin-bottom: 1px;
        }
        `;

        const breadcrumbItems = this.breadCrumbHistory.map((breadCrumb, i) => {
            return (<Breadcrumb.Item id={this.breadCrumbHistory[i].name} onClick={() => this.HandleBreadCrumbClick(breadCrumb.type, i)} active={(i === this.breadCrumbHistory.length - 1)} key={i}>
                {this.breadCrumbHistory[i].name}
            </Breadcrumb.Item>);
        });
        const areOnHomePage = (this.breadCrumbHistory.length === 1);

        if (!areOnHomePage) {
            breadcrumbItems.push(
                (<Breadcrumb.Item key={breadcrumbItems.length} active>
                    {typeToTitle(this.state.rightTableType)}
                </Breadcrumb.Item>)
            );
        }

        return (
            <Breadcrumb className={breadCrumbStyle}>
                {breadcrumbItems}
            </Breadcrumb>
        );
    }

    render() {
        const tableMarginPixels = 15;

        const displayStyle = css`
            width: calc(50% - ${tableMarginPixels * 2}px);
            margin-left:${tableMarginPixels}px;
            margin-right:${tableMarginPixels}px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;

        const outerDivDisplay = css`
            display: block;
            `;

        const breadCrumbDisplay = css`
            display: block;
            height:${sharedSizesAndDimensions.BREADCRUMBS_HEIGHT}px;
            margin:2px;
            `;

        const minWidth = css`
            min-width:1000px;
        `;

        const areOnHomePage = (this.breadCrumbHistory.length === 1);
        const totalDiff = sharedSizesAndDimensions.DEFAULT_HEADER_HEIGHT + sharedSizesAndDimensions.BREADCRUMBS_HEIGHT + sharedSizesAndDimensions.BOTTOM_GUTTERING;

        const line = css`
            border-left: 1px solid black;
            display : ${(areOnHomePage) ? "inline-block" : "none"};
            height : calc(100% - ${totalDiff}px); 
            position: fixed;
            z-index: -1;
        `;

        const leftBox = this.getList();
        const rightBox = this.getList(true);



        return (
            <div className={minWidth} >
                <div className={breadCrumbDisplay} >
                    {this.getBreadcrumbElement()}
                </div>
                <div className={outerDivDisplay}>
                    <div className={displayStyle} id="left">
                        {leftBox}
                    </div>
                    <div className={line} />
                    <div className={displayStyle} id="right">
                        {rightBox}
                    </div>
                </div>
            </div>
        );
    }
}

