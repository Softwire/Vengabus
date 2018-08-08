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
            return new Promise(function (resolve, reject) {
                resolve([
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
            });
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

        deleteQueueMessages = (queueName) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        deleteTopicMessages = (topicName) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        deleteSubscriptionMessages = (topicName, subscriptionName) => {
            return new Promise(function (resolve, reject) {
                resolve(200);
            });
        }

        listQueueMessages = (queueName) => {
            return new Promise(function (resolve, reject) {
                resolve([
                    {
                        "predefinedProperties": { "MessageId": "sadas" },
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
                        "predefinedProperties": { "MessageId": "sadas" },
                        "customProperties": { "fjaklsdjf": "alskdjlks" },
                        "messageBody": "alskdjlaskdklj"
                    }
                ]);
            });
        }

        getWriteableMessageProperties = () => {
            return new Promise(function (resolve, reject) {
                resolve(['MessageId', 'ContentType']);
            });
        }

        getReadableMessageProperties = () => {
            return new Promise(function (resolve, reject) {
                resolve(['MessageId', 'ContentType']);
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

it.only('passes smoke tests without crashing', () => {
    let wrapper = mount(<App />);

    let noRejection = false;

    const connectButton = wrapper.find("#connectButton").last();
    const navbarHomePageButton = wrapper.find("#navbarHomePageButton").last();
    const navbarSendMessagePageButton = wrapper.find("#navbarSendMessagePageButton").last();
    const navbarDemoPageButton = wrapper.find("#navbarDemoPageButton").last();
    expect(navbarHomePageButton.exists()).toBe(true);
    expect(navbarSendMessagePageButton.exists()).toBe(true);
    expect(navbarDemoPageButton.exists()).toBe(true);
    expect(connectButton.exists()).toBe(true);

    let demoPageReplayMessageButton;
    let buttonsOnSendMessagePageFromDemoReplayMessage;
    let addNewApplicationSpcificProperty;

    /* TestPath:
     *  Go to Demo Page
     *  Click ReplayMessage button
     */
    connectButton.prop("onClick")();
    return testHelper.afterReactHasUpdated()
        .then(() => { /*Go to Demo Page*/
            navbarDemoPageButton.simulate("click");
            return testHelper.afterReactHasUpdated();
        }).then(() => { /* Click ReplayMessage button */
            const replayMessageButton = wrapper.find("#demoPageReplayMessageButton").first();
            expect(replayMessageButton.exists()).toBe(true);
            replayMessageButton.simulate("click");
            return testHelper.afterReactHasUpdated();
            // }).then(() => {
            //     var prom = new Promise((resolve, reject) => {
            //         let wait = setTimeout(() => {
            //             clearTimeout(wait);
            //             resolve(testHelper.afterReactHasUpdated());
            //         }, 200);
            //     });
            //     return prom;
        }).then(() => {
            const buttonFromPreviousPage = wrapper.find("#demoPageReplayMessageButton").first();
            expect(buttonFromPreviousPage.exists()).toBe(false);

            const buttonsOnReplayMessagePage = wrapper.find(Button);
            expect(buttonsOnReplayMessagePage.length).toBeGreaterThan(4);

            navbarHomePageButton.simulate("click");
            return testHelper.afterReactHasUpdated();
        }).then(() => {
            navbarSendMessagePageButton.simulate("click");
            return testHelper.afterReactHasUpdated();
        }).then(() => {
            const buttonsOnSendMessagePage = wrapper.find(Button);
            const addNewPropertyButton = buttonsOnSendMessagePage.at(2); //qq search by ID.
            addNewPropertyButton.simulate("click");
            return testHelper.afterReactHasUpdated();
        }).catch((e) => {
            //if there's an expect failing in any of the above thens, it throws and enters catch,
            //but will not report an error in test. So we need to create a false expect here.
            console.log(e);
            expect(true).toEqual(false);
        });
});