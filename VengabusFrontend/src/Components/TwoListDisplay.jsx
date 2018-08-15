import React, { Component } from 'react';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { QueueList } from './QueueList';
import { TopicList } from './TopicList';
import { MessageList } from './MessageList';
import { css } from 'react-emotion';
import { Breadcrumb, Button } from 'react-bootstrap';
import { SubscriptionList } from './SubscriptionList';
import { EndpointTypes, typeToTitle } from '../Helpers/EndpointTypes';
import { sharedSizesAndDimensions } from '../Helpers/SharedSizesAndDimensions';


export class TwoListDisplay extends Component {
    constructor(props) {
        super(props);
        this.displayHistory = [];
        this.breadCrumbHistory = [{ name: "Home", type: undefined }];
        this.messageButtonDisabled = false;
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
        this.messageButtonDisabled = true;
        this.setState({
            messageData: undefined,
            rightTableType: EndpointTypes.MESSAGE
        }, this.updateEndpointMessageData);
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
            rightTableType: EndpointTypes.MESSAGE
        }, () => this.updateEndpointMessageData(false));
    }

    handleMessageToggle = (isNewTypeDeadLetter) => {
        this.messageButtonDisabled = true;
        this.setState({
            messageData: undefined,
            rightTableType: isNewTypeDeadLetter ? EndpointTypes.DEADLETTER : EndpointTypes.MESSAGE
        }, () => this.updateEndpointMessageData(isNewTypeDeadLetter));
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


    updateEndpointMessageData = (isMessageDeadletters) => {
        const serviceBusService = serviceBusConnection.getServiceBusService();
        let fetchedMessageData;
        const leftTableType = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].type;
        if (leftTableType === EndpointTypes.QUEUE || typeof leftTableType === 'undefined') {
            const queueName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            if (isMessageDeadletters) {
                fetchedMessageData = serviceBusService.listQueueDeadLetterMessages(queueName);
            } else {
                fetchedMessageData = serviceBusService.listQueueMessages(queueName);
            }
        } else {
            const topicName = this.breadCrumbHistory[this.breadCrumbHistory.length - 2].name;
            const subscriptionName = this.breadCrumbHistory[this.breadCrumbHistory.length - 1].name;
            if (isMessageDeadletters) {
                fetchedMessageData = serviceBusService.listSubscriptionDeadLetterMessages(topicName, subscriptionName);
            } else {
                fetchedMessageData = serviceBusService.listSubscriptionMessages(topicName, subscriptionName);
            }
        }
        fetchedMessageData.then((result) => {
            this.messageButtonDisabled = false;
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

        const deadLetterToggleButtonStyle = css`
                margin-right: 0px;
                float: right;
                margin: 9px;
                width: 120px ;
        `;

        switch (typeOfData) {
            case EndpointTypes.QUEUE:
                return (
                    <React.Fragment>
                        <div>
                            <h2>{typeToTitle(EndpointTypes.QUEUE)}</h2>
                        </div>
                        <QueueList
                            queueData={this.state.queueData}
                            clickFunction={this.handleQueueRowClick}
                            currentlySelectedName={currentSelection}
                        />
                    </React.Fragment>
                );
            case EndpointTypes.TOPIC:
                return (
                    <React.Fragment>
                        <div>
                            <h2>{typeToTitle(EndpointTypes.TOPIC)}</h2>
                        </div>
                        <TopicList
                            topicData={this.state.topicData}
                            clickFunction={this.handleTopicRowClick}
                            currentlySelectedName={currentSelection}
                        />
                    </React.Fragment>
                );

            case EndpointTypes.SUBSCRIPTION:
                return (
                    <React.Fragment>
                        <div>
                            <h2>{typeToTitle(EndpointTypes.SUBSCRIPTION)}</h2>
                        </div>
                        <SubscriptionList
                            subscriptionData={this.state.subscriptionData}
                            clickFunction={this.handleSubscriptionRowClick}
                            currentlySelectedName={currentSelection}
                        />
                    </React.Fragment>
                );
            case EndpointTypes.MESSAGE:

                return (
                    <React.Fragment>
                        <div >
                            <h2 className={displayStyle} >{typeToTitle(EndpointTypes.MESSAGE)}</h2>
                            <Button className={deadLetterToggleButtonStyle} onClick={() => this.handleMessageToggle(true)} disabled={this.messageButtonDisabled} > Deadletters </Button>
                        </div>
                        <MessageList
                            messageData={this.state.messageData}
                        />
                    </React.Fragment>

                );
            case EndpointTypes.DEADLETTER:
                return (
                    <React.Fragment>
                        <div>
                            <h2 className={displayStyle} >{typeToTitle(EndpointTypes.DEADLETTER)}</h2>
                            <Button className={deadLetterToggleButtonStyle} onClick={() => this.handleMessageToggle(false)} disabled={this.messageButtonDisabled} > Live Messages </Button>
                        </div>
                        <MessageList
                            messageData={this.state.messageData}
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
            return (<Breadcrumb.Item onClick={() => this.HandleBreadCrumbClick(breadCrumb.type, i)} active={(i === this.breadCrumbHistory.length - 1)} key={i}>
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

        const displayStyle = css`
            width: 45%;
            margin-left: 10px;
            margin-right:10px;
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
            height : calc(100vh - ${totalDiff}px); 
            position: absolute;
        `;

        const leftBox = this.getList();
        const rightBox = this.getList(true);

        return (
            <div className={minWidth} >
                <div className={breadCrumbDisplay} >
                    {this.getBreadcrumbElement()}
                </div>
                <div className={outerDivDisplay}>
                    <div className={displayStyle}>
                        {leftBox}
                    </div>
                    <div className={line} />
                    <div className={displayStyle}>
                        {rightBox}
                    </div>
                </div>
            </div>
        );
    }
}

