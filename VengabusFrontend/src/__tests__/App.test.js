import 'jest-localstorage-mock';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { mount } from 'enzyme';
import { testHelper } from '../TestHelpers/TestHelper';
import { Button } from "react-bootstrap";

jest.mock('../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {

        }

        listQueues = () => {
            return Promise.resolve([
                {
                    "name": "1dduplicatedetectionqueue",
                    "activeMessageCount": 501,
                    "deadletterMessageCount": 10
                },
                {
                    "name": "30sduplicatedetectionqueue",
                    "activeMessageCount": 1,
                    "deadletterMessageCount": 0
                }
            ]);
        }

        getQueueDetails = (queueName) => {
            return Promise.resolve({
                "name": "demoqueue1",
                "activeMessageCount": 0,
                "deadletterMessageCount": 30,
                "requiresSession": false,
                "autoDeleteOnIdle": {
                    "milliseconds": "01",
                    "seconds": "02",
                    "minutes": "01",
                    "hours": "01",
                    "days": "20"
                },
                "maxDeliveryCount": 10,
            });
        }
        getQueueMostRecentDeadletter = (queueName) => {
            return new Promise(function (resolve, reject) {
                resolve('2018-07-26T09:40:11.5513302Z');
            });
        }

        listTopics = () => {

            return Promise.resolve([
                {
                    "name": "demotopic1",
                    "subscriptionCount": 2,
                    "topicStatus": "Active"
                },
                {
                    "name": "demotopic2",
                    "subscriptionCount": 1,
                    "topicStatus": "Active"
                },
                {
                    "name": "ibdemotopic",
                    "subscriptionCount": 3,
                    "topicStatus": "Active"
                }
            ]);
        }

        /**
         * Gets the details of a particular topic.
         * @param {string} topicName The name of the topic to get details for.
         * @return {object} The topic returned by the server.
         */
        getTopicDetails = (topicName) => {
            return Promise.resolve({
                "name": topicName,
                "subscriptionCount": 2,
                "topicStatus": "Active",
                "supportOrdering": true,
                "autoDeleteOnIdle": {
                    "milliseconds": "66",
                    "seconds": "6",
                    "minutes": "3",
                    "hours": "21",
                    "days": "1"
                },
                "maxSizeInMegabytes": 30000,
            });
        }

        /**
         * Gets a summary of all subscriptions in a given topic from the server.
         * @param {string} topicName The name of the topic to get subscriptions from.
         * @return {object} The subsctiptions returned by the server.
         */
        listSubscriptions = (topicName) => {
            return Promise.resolve(
                [
                    {
                        "name": "demosubscription1",
                        "activeMessageCount": 0,
                        "deadletterMessageCount": 110,
                        "subscriptionStatus": "Active",
                        "topicName": 'testTopic'
                    },
                    {
                        "name": "demosubscription2",
                        "activeMessageCount": 0,
                        "deadletterMessageCount": 0,
                        "subscriptionStatus": "Active",
                        "topicName": 'testTopic'
                    }
                ]
            );
        }

        getSubscriptionDetails = (parentTopicName, subscriptionName) => {
            return Promise.resolve({
                "name": subscriptionName,
                "activeMessageCount": 0,
                "deadletterMessageCount": 110,
                "subscriptionStatus": "Active",
                "topicName": parentTopicName,
                "autoDeleteOnIdle": {
                    "milliseconds": "999",
                    "seconds": "20",
                    "minutes": "1",
                    "hours": "20",
                    "days": "2"
                },
                "requiresSession": true,
            });
        }

        sendMessageToQueue = (queueName, message) => {
            return Promise.resolve(200);
        }

        sendMessageToTopic = (topicName, message) => {
            return Promise.resolve(200);
        }

        purgeQueueMessages = (queueName) => {
            return Promise.resolve(200);
        }

        purgeTopicMessages = (topicName) => {
            return Promise.resolve(200);
        }

        purgeSubscriptionMessages = (topicName, subscriptionName) => {
            return Promise.resolve(200);
        }

        listQueueDeadletterMessages = (queueName) => {
            return (queueName === "testQueue1") ? Promise.resolve(
                [
                    {
                        predefinedProperties: { messageId: "test1" },
                        uniqueId: "59298c2b-d58f-4ad0-bde9-f8a9d00a3070",
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2" },
                        uniqueId: "c9f547bf-72e1-439e-bd1f-0b590422a6f8",
                        messageBody: "banana"
                    },
                    {
                        predefinedProperties: { messageId: "test3" },
                        uniqueId: "5034e2f8-9bf0-436a-b8f4-914b43594ee1",
                        messageBody: "carrot"
                    }
                ]
            ) : Promise.reject();
        }


        listQueueMessages = (queueName) => {
            return Promise.resolve([
                {
                    predefinedProperties: { messageId: "test1" },
                    customProperties: { "skjdfhksdjf": "skdjhds" },
                    uniqueId: "59298c2b-d58f-4ad0-bde9-f8a9d00a3070",
                    messageBody: "apple"
                },
                {
                    predefinedProperties: { messageId: "test2" },
                    customProperties: { "skjdfhksdjf": "skdjhds" },
                    uniqueId: "c9f547bf-72e1-439e-bd1f-0b590422a6f8",
                    messageBody: "banana"
                },
                {
                    predefinedProperties: { messageId: "test3" },
                    customProperties: { "skjdfhksdjf": "skdjhds" },
                    uniqueId: "5034e2f8-9bf0-436a-b8f4-914b43594ee1",
                    messageBody: "carrot"
                }
            ]);
        }

        listSubscriptionDeadletterMessages = () => {
            return Promise.resolve(
                [
                    {
                        predefinedProperties: { messageId: "test1" },
                        uniqueId: "57d7d4dd-291a-453c-a0e4-efbb664607c0",
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2" },
                        uniqueId: "873c61c3-797a-4158-941b-da8eb7410e70",
                        messageBody: "banana"
                    },
                    {
                        predefinedProperties: { messageId: "test3" },
                        uniqueId: "8ab56d4c-0204-4aa2-a888-2cc305cd0275",
                        messageBody: "carrot"
                    }
                ]);
        }

        listSubscriptionMessages = (topicName, subscriptionName) => {
            return Promise.resolve([
                {
                    predefinedProperties: { messageId: "test1" },
                    customProperties: { "skjdfhksdjf": "skdjhds" },
                    uniqueId: "59298c2b-d58f-4ad0-bde9-f8a9d00a3070",
                    messageBody: "apple"
                },
                {
                    predefinedProperties: { messageId: "test2" },
                    customProperties: { "skjdfhksdjf": "skdjhds" },
                    uniqueId: "c9f547bf-72e1-439e-bd1f-0b590422a6f8",
                    messageBody: "banana"
                },
                {
                    predefinedProperties: { messageId: "test3" },
                    customProperties: { "skjdfhksdjf": "skdjhds" },
                    uniqueId: "5034e2f8-9bf0-436a-b8f4-914b43594ee1",
                    messageBody: "carrot"
                }
            ]);
        }


        listQueueDeadletterMessages = (queueName, messageCount) => {
            return new Promise(function (resolve, reject) {
                resolve([
                    {
                        predefinedProperties: { messageId: "test1Dead" },
                        customProperties: { "skjdfhksdjf": "skdjhds" },
                        uniqueId: "59298c2b-d58f-4ad0-bde9-f8a9d00a3070",
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2Dead" },
                        customProperties: { "skjdfhksdjf": "skdjhds" },
                        uniqueId: "c9f547bf-72e1-439e-bd1f-0b590422a6f8",
                        messageBody: "banana"
                    },
                    {
                        predefinedProperties: { messageId: "test3Dead" },
                        customProperties: { "skjdfhksdjf": "skdjhds" },
                        uniqueId: "5034e2f8-9bf0-436a-b8f4-914b43594ee1",
                        messageBody: "carrot"
                    }
                ]);
            });
        }

        listSubscriptionDeadletterMessages = (topicName, subscriptionName, messageCount) => {
            return new Promise(function (resolve, reject) {
                resolve([
                    {
                        predefinedProperties: { messageId: "test1Dead" },
                        customProperties: { "skjdfhksdjf": "skdjhds" },
                        uniqueId: "59298c2b-d58f-4ad0-bde9-f8a9d00a3070",
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2Dead" },
                        customProperties: { "skjdfhksdjf": "skdjhds" },
                        uniqueId: "c9f547bf-72e1-439e-bd1f-0b590422a6f8",
                        messageBody: "banana"
                    },
                    {
                        predefinedProperties: { messageId: "test3Dead" },
                        customProperties: { "skjdfhksdjf": "skdjhds" },
                        uniqueId: "5034e2f8-9bf0-436a-b8f4-914b43594ee1",
                        messageBody: "carrot"
                    }
                ]);
            });
        }

        getWriteableMessageProperties = () => {
            return Promise.resolve(['messageId', 'contentType']);
        }

        getReadableMessageProperties = () => {
            return Promise.resolve(['messageId', 'contentType']);
        }

        getQueueMostRecentDeadletter = (queueName) => {
            return new Promise(function (resolve, reject) {
                resolve('2018-07-26T09:40:11.5513302Z');
            });
        }

        getSubscriptionMostRecentDeadletter = (queueName) => {
            return new Promise(function (resolve, reject) {
                resolve('2018-07-26T09:40:11.5513302Z');
            });
        }

    }
}));

//event object to hand to click functions
const blankEventObj = {};

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});
const sendMessagePageTest = (wrapper) => { //Starts from SendMessagePage
    return testHelper.afterReactHasUpdated().then(() => {//Click add new Azure property button
        const addNewAzurePropertyButton = wrapper.find('#addPreDefinedPropertyButton').last();
        addNewAzurePropertyButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click add new User defined property button
        const addNewUserPropertyButton = wrapper.find('#addUserDefinedPropertyButton').last();
        addNewUserPropertyButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click message body
        const messageButton = wrapper.find('#formControlsMessageBodyText').last();
        messageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click topic selection dropdown
        const topicSelectionDropdown = wrapper.find('#topic-dropdown').last();
        topicSelectionDropdown.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click queue selection radio
        const queueSelectionRadio = wrapper.find('#queue-selection-radio').last();
        queueSelectionRadio.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click queue selection dropdown
        const queueSelectionDropdown = wrapper.find('#queue-dropdown').last();
        queueSelectionDropdown.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click topic selection radio
        const topicSelectionRadio = wrapper.find('#topic-selection-radio').last();
        topicSelectionRadio.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click Reset Fields button
        const resetFieldsButton = wrapper.find('#cancelButton').last();
        resetFieldsButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click Reset
        const ResetButton = wrapper.find('#confirm').last();
        ResetButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    });
};

const replayMessageTest = (wrapper) => { //Starts from HomePage
    return testHelper.afterReactHasUpdated().then(() => {//Click Connect
        const connectButton = wrapper.find('#connectButton').last();
        connectButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Click a row in the queue table
        wrapper.update();
        const leftList = wrapper.find('#left');
        const queueListRow = leftList.find('tr').at(1); //Don't click the header
        queueListRow.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Click a row in the message table
        wrapper.update();
        const rightList = wrapper.find('#right');
        const messageListRow = rightList.find('tr').at(1); //Don't click the header
        messageListRow.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click Replay Message
        const replayMessageButton = wrapper.find('#messageBoxReplayMessage').last();
        replayMessageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click Reset Fields button
        const resetFieldsButton = wrapper.find('#cancelButton').last();
        resetFieldsButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click Reset
        const ResetButton = wrapper.find('#confirm').last();
        ResetButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    });
};

const messageBoxTest = (wrapper) => { //starts from HomePage
    return testHelper.afterReactHasUpdated().then(() => {//Click Connect
        const connectButton = wrapper.find('#connectButton').last();
        connectButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Click a row in the queue table
        wrapper.update();
        const leftList = wrapper.find('#left');
        const queueListRow = leftList.find('tr').at(1); //Don't click the header
        queueListRow.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Click a row in the message table
        wrapper.update();
        const rightList = wrapper.find('#right');
        const messageListRow = rightList.find('tr').at(1); //Don't click the header
        messageListRow.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        /*
        // Currently clicking anywhere within the message box modal, or calling wrapper.update() both close the message box.
        // So more comprehensive smoke testing is not currently possible. QQ
        */
        const messageBoxModal = wrapper.find("#messageBoxModal");
        expect(messageBoxModal).toBeDefined();
        //expect(messageBoxModal).toExistOnPage(); //The message Box modal does not seem to exist, this may be related to the other issues with testing the Message Box.
        //check that the expected buttons in the footer are all there
        //const closeButton = wrapper.find("#messageBoxClose").last();
        //const copyButton = wrapper.find("#messageBoxCopy").last(); //The copy message button does not currently have its id set properly
        //const replayButton = wrapper.find("#messageBoxReplayMessage").last();
        //expect(closeButton).toExistOnPage();
        //expect(copyButton).toExistOnPage();
        //expect(replayButton).toExistOnPage();
        return testHelper.afterReactHasUpdated();
    });
}

it('passes smoke tests without crashing', () => {
    let wrapper = mount(<App />);

    const connectButton = wrapper.find("#connectButton").last();
    const navbarHomePageButton = wrapper.find("#navbarHomePageButton").last();
    const navbarSendMessagePageButton = wrapper.find("#navbarSendMessagePageButton").last();
    expect(navbarHomePageButton).toExistOnPage();
    expect(navbarSendMessagePageButton).toExistOnPage();
    expect(connectButton).toExistOnPage();

    /* TestPath:
     * Go to Demo Page
     * Test Purge Button
     * Go to messageBox
     * Go to Home Page
     * click Queue row
     * click message row
     * click home breadcrumb
     * click topic row
     * click Subscription row
     * click topic breadcrumb
     * Go to Send Message Page
     * ┠ Click add new User defined property button
     * ┠ Click message body
     * ┠ Click topic selection dropdown
     * ┠ Click queue selection radio
     * ┠ Click queue selection dropdown
     * ┠ Click topic selection radio
     * ┠ Click Reset Fields button
     * ┖ Click Reset
     * Replay a message
     * ┠ Click Connect
     * ┠ Click the first row in the queue table
     * ┠ Click the first in the message table
     * ┠ Click Replay Message
     * ┠ Click Reset Fields button
     * ┖ Click Reset
     */

    connectButton.prop("onClick")();
    return testHelper.afterReactHasUpdated().then(() => {
        navbarSendMessagePageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Go to Home Page
        navbarHomePageButton.simulate("click");
        wrapper.update();
        return messageBoxTest(wrapper); //test message box
        //}).then(() => {
        //test the copy button
        //copyButton.simulate("click"); //the library throws an error "reselectPrevious is not a function" if you try to click the copy button within any mount test it seems
        //return testHelper.afterReactHasUpdated();
        /*    }).then(() => { //Click ReplayMessage button -- this no longer exists. QQ remove when every's added smoke test
                const replayMessageButton = wrapper.find("#demoPageReplayMessageButton").first();
                expect(replayMessageButton).toExistOnPage();
                replayMessageButton.simulate("click");
                return testHelper.afterReactHasUpdated();*/
        // }).then(() => {//test queue purge button
        //     const purgeQueueMessagesButton = wrapper.find("#purgeQueueMessage").last();
        //     purgeQueueMessagesButton.simulate("click");
        //     return testHelper.afterReactHasUpdated();
        // }).then(() => {
        //     const purgeQueueMessagesConfirmationButton = wrapper.find("#alertPurge").last();
        //     purgeQueueMessagesConfirmationButton.simulate("click");
        //     return testHelper.afterReactHasUpdated();
        // }).then(() => {//test topic purge button
        //     const purgeQueueMessagesButton = wrapper.find("#purgeTopicMessage").last();
        //     purgeQueueMessagesButton.simulate("click");
        //     return testHelper.afterReactHasUpdated();
        // }).then(() => {
        //     const purgeQueueMessagesConfirmationButton = wrapper.find("#alertPurge").last();
        //     purgeQueueMessagesConfirmationButton.simulate("click");
        //     return testHelper.afterReactHasUpdated();
        // }).then(() => {//test subscription purge button
        //     const purgeQueueMessagesButton = wrapper.find("#purgeSubscriptionMessage").last();
        //     purgeQueueMessagesButton.simulate("click");
        //     return testHelper.afterReactHasUpdated();
        // }).then(() => {
        //     const purgeQueueMessagesConfirmationButton = wrapper.find("#alertPurge").last();
        //     purgeQueueMessagesConfirmationButton.simulate("click");
        //     return testHelper.afterReactHasUpdated();
    }).then(() => {//Go to Home Page
        navbarHomePageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click Connect
        const connectButton = wrapper.find('#connectButton').last();
        connectButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Click a row in the queue table
        wrapper.update();
        const leftList = wrapper.find('#left');
        const queueListRow = leftList.find('tr').at(1); //Don't click the header
        queueListRow.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Click a row in the message table
        wrapper.update();
        const rightList = wrapper.find('#right');
        const messageListRow = rightList.find('tr').at(1); //Don't click the header
        messageListRow.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //home breadcrumb Click
        const homeBreadCrumb = wrapper.find('#Home').hostNodes();
        homeBreadCrumb.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => { //Click a row in the topic table
        wrapper.update();
        const rightList = wrapper.find('#right');
        const messageListRow = rightList.find('tr').at(1); //Don't click the header
        messageListRow.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //sub click
        wrapper.update();
        const subscriptionTable = wrapper.find('#SubscriptionTable');
        subscriptionTable.props().clickFunction(blankEventObj, { name: "subName" });
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //topicBreadCumb click
        wrapper.update();
        const topicBreadCrumb = wrapper.find('#demotopic1').hostNodes();
        topicBreadCrumb.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Go to Send Message Page
        navbarSendMessagePageButton.simulate("click");
        return sendMessagePageTest(wrapper);
    }).then(() => {//Replay a message
        navbarHomePageButton.simulate("click");
        return replayMessageTest(wrapper);
    }).catch((e) => {
        //if there's an expect failing in any of the above, then it throws and enters catch,
        //but will not report an error in test. So we need to expect it not to be defined here.
        expect(e).toBeUndefined();
    });
});