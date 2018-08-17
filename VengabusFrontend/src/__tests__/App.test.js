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
            return new Promise(function (resolve, reject) {
                resolve({
                    "name": "demoqueue1",
                    "activeMessageCount": 0,
                    "deadletterMessageCount": 30
                });
            });
        }

        listTopics = () => {
            return new Promise(function (resolve, reject) {
                resolve([
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
            });
        }

        /**
         * Gets the details of a particular topic.
         * @param {string} topicName The name of the topic to get details for.
         * @return {object} The topic returned by the server.
         */
        getTopicDetails = (topicName) => {
            return new Promise(function (resolve, reject) {
                resolve({
                    "name": topicName,
                    "subscriptionCount": 2,
                    "topicStatus": "Active"
                });
            });
        }

        /**
         * Gets the details of all subscriptions in a given topic from the server.
         * @param {string} topicName The name of the topic to get subscriptions from.
         * @return {object} The subsctiptions returned by the server.
         */
        listSubscriptions = (topicName) => {
            return new Promise(function (resolve, reject) {
                resolve(
                    [
                        {
                            "name": "demosubscription1",
                            "activeMessageCount": 0,
                            "deadletterMessageCount": 110,
                            "subscriptionStatus": "Active"
                        },
                        {
                            "name": "demosubscription2",
                            "activeMessageCount": 0,
                            "deadletterMessageCount": 0,
                            "subscriptionStatus": "Active"
                        }
                    ]
                );
            });
        }

        getSubscriptionDetails = (parentTopicName, subscriptionName) => {
            return new Promise(function (resolve, reject) {
                resolve({
                    "name": subscriptionName,
                    "activeMessageCount": 0,
                    "deadletterMessageCount": 110,
                    "subscriptionStatus": "Active"
                });
            });
        }

        sendMessageToQueue = (queueName, message) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        sendMessageToTopic = (topicName, message) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        purgeQueueMessages = (queueName) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        purgeTopicMessages = (topicName) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        purgeSubscriptionMessages = (topicName, subscriptionName) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        listQueueMessages = (queueName) => {
            return new Promise(function (resolve, reject) {
                resolve([
                    {
                        "predefinedProperties": { "messageId": "sadas" },
                        "customProperties": { "fjaklsdjf": "alskdjlks" },
                        "messageBody": "alskdjlaskdklj"
                    }
                ]);
            });
        }

        listSubscriptionMessages = (topicName, subscriptionName) => {
            return new Promise(function (resolve, reject) {
                resolve([
                    {
                        "predefinedProperties": { "messageId": "sadas" },
                        "customProperties": { "fjaklsdjf": "alskdjlks" },
                        "messageBody": "alskdjlaskdklj"
                    }
                ]);
            });
        }

        getWriteableMessageProperties = () => {
            return new Promise(function (resolve, reject) {
                resolve(['messageId', 'ContentType']);
            });
        }

        getReadableMessageProperties = () => {
            return new Promise(function (resolve, reject) {
                resolve(['messageId', 'ContentType']);
            });
        }

        getServiceBusProperties() {
            return new Promise(function (resolve, reject) {
                resolve({
                    name: 'name ex',
                    status: 'true',
                    location: 'uk?',
                    permission: 'all'
                });
            });
        }


    }
}));

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});

const messageBoxTest = (messageRow, wrapper) => {
    messageRow.simulate("click"); //open the messageBox modal 
    expect(wrapper.find("#messageBoxModal")).toExistOnPage();

    //test the Pre-defined Properties and User-defined Properties panels
    let glyphicons = wrapper.find("#messageBoxModalBody .panel .glyphicon");
    //click the glyphicons twice to toggle the panels open and shut
    glyphicons.forEach((glyph) => glyph.simulate("click"));
    glyphicons.forEach((glyph) => glyph.simulate("click"));

    //check that the expected buttons in the footer are all there
    const closeButton = wrapper.find("#messageBoxClose").last();
    const copyButton = wrapper.find("#messageBoxCopy").last();
    const replayButton = wrapper.find("#messageBoxReplayMessage").last();
    expect(closeButton).toExistOnPage();
    expect(copyButton).toExistOnPage();
    expect(replayButton).toExistOnPage();

    closeButton.simulate("click"); //test the close button
    //test the copy button
    //copyButton.simulate("click"); //qq JF the library throws an error "reselectPrevious is not a function" if you try to click the copy button within any mount test it seems
    replayButton.simulate("click"); //test the replay message button

    wrapper.find("#navbarDemoPageButton").last().simulate("click"); //get back to the demo page
};

it('passes smoke tests without crashing', () => {
    let wrapper = mount(<App />);

    const connectButton = wrapper.find("#connectButton").last();
    const navbarHomePageButton = wrapper.find("#navbarHomePageButton").last();
    const navbarSendMessagePageButton = wrapper.find("#navbarSendMessagePageButton").last();
    const navbarDemoPageButton = wrapper.find("#navbarDemoPageButton").last();
    expect(navbarHomePageButton).toExistOnPage();
    expect(navbarSendMessagePageButton).toExistOnPage();
    expect(navbarDemoPageButton).toExistOnPage();
    expect(connectButton).toExistOnPage();

    /* TestPath:
     * Go to Demo Page
     * Test Purge Button
     * Go to messageBox
     * [Go to replay message page at some point qq MK LW JF]
     * Go to Home Page
     * Go to Send Message Page
     * Click add new property button
     */
    connectButton.prop("onClick")();
    return testHelper.afterReactHasUpdated().then(() => { //Go to Demo Page
        navbarDemoPageButton.simulate("click");
        const demoMessageTableRows = wrapper.find("#demoMessageList .table tbody tr").last(); //the rows of the messageList table
        messageBoxTest(demoMessageTableRows.childAt(0), wrapper); //test messageBox for the first message on the demo page
        return testHelper.afterReactHasUpdated();
        /*    }).then(() => { //Click ReplayMessage button -- this no longer exists. QQ remove when every's added smoke test
                const replayMessageButton = wrapper.find("#demoPageReplayMessageButton").first();
                expect(replayMessageButton).toExistOnPage();
                replayMessageButton.simulate("click");
                return testHelper.afterReactHasUpdated();*/
    }).then(() => {//test queue purge button
        const purgeQueueMessagesButton = wrapper.find("#purgeQueueMessage").last();
        purgeQueueMessagesButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        const purgeQueueMessagesConfirmationButton = wrapper.find("#alertPurge").last();
        purgeQueueMessagesConfirmationButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//test topic purge button
        const purgeQueueMessagesButton = wrapper.find("#purgeTopicMessage").last();
        purgeQueueMessagesButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        const purgeQueueMessagesConfirmationButton = wrapper.find("#alertPurge").last();
        purgeQueueMessagesConfirmationButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//test subscription purge button
        const purgeQueueMessagesButton = wrapper.find("#purgeSubscriptionMessage").last();
        purgeQueueMessagesButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        const purgeQueueMessagesConfirmationButton = wrapper.find("#alertPurge").last();
        purgeQueueMessagesConfirmationButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Go to Home Page
        const buttonFromPreviousPage = wrapper.find("#demoPageReplayMessageButton").first();//this still works, as that button no longer exists
        expect(buttonFromPreviousPage).not.toExistOnPage();

        /*    const buttonsOnReplayMessagePage = wrapper.find(Button); -- this is no longer valid. QQ remove as above
            expect(buttonsOnReplayMessagePage.length).toBeGreaterThan(4);*/

        navbarHomePageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Go to Send Message Page
        navbarSendMessagePageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {//Click add new property button
        const buttonsOnSendMessagePage = wrapper.find(Button);
        const addNewPropertyButton = buttonsOnSendMessagePage.at(2);
        addNewPropertyButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).catch((e) => {
        //if there's an expect failing in any of the above, then it throws and enters catch,
        //but will not report an error in test. So we need to expect it not to be defined here.
        expect(e).toBeUndefined();
    });
});