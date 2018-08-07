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

it('passes smoke tests without crashing', () => {
    let wrapper = mount(<App />);

    let noRejection = false;

    const connectButton = wrapper.find("#connectButton").first();
    const navbarHomePageButton = wrapper.find("#navbarHomePageButton").first();
    const navbarSendMessagePageButton = wrapper.find("#navbarSendMessagePageButton").first();
    const navbarDemoPageButton = wrapper.find("#navbarDemoPageButton").first();
    expect(navbarHomePageButton.exists()).toBe(true);
    expect(navbarSendMessagePageButton.exists()).toBe(true);
    expect(navbarDemoPageButton.exists()).toBe(true);
    expect(connectButton.exists()).toBe(true);

    let demoPageReplayMessageButton;
    let buttonsOnSendMessagePageFromDemoReplayMessage;
    let addNewAzurePropertyButton;

    connectButton.simulate("click");
    return testHelper.afterReactHasUpdated().then(() => {
        navbarDemoPageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        demoPageReplayMessageButton = wrapper.find(Button).first();
        expect(demoPageReplayMessageButton.exists()).toBe(true);
        demoPageReplayMessageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        return new Promise((resolve, reject) => {
            let wait = setTimeout(() => {
                clearTimeout(wait);
                resolve('');
            }, 200)
        });
    }).then(() => {
        demoPageReplayMessageButton = wrapper.find("#demoPageReplayMessageButton").first();
        expect(demoPageReplayMessageButton.exists()).toBe(false);
        buttonsOnSendMessagePageFromDemoReplayMessage = wrapper.find(Button);
        console.log(buttonsOnSendMessagePageFromDemoReplayMessage.debug());
        expect(buttonsOnSendMessagePageFromDemoReplayMessage.length).toEqual(5);
        navbarHomePageButton.simulate("click");
        navbarSendMessagePageButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        buttonsOnSendMessagePageFromDemoReplayMessage = wrapper.find(Button);
        expect(buttonsOnSendMessagePageFromDemoReplayMessage.length).toEqual(4);
        addNewAzurePropertyButton = buttonsOnSendMessagePageFromDemoReplayMessage.first();
        addNewAzurePropertyButton.simulate("click");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        buttonsOnSendMessagePageFromDemoReplayMessage = wrapper.find(Button);
        expect(buttonsOnSendMessagePageFromDemoReplayMessage.length).toEqual(5);
    }).catch((e) => {
        console.log(e);
        expect(1).toEqual(2);
    });
});