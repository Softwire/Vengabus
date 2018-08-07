import 'jest-localstorage-mock';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
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

it('passes smoke tests', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});