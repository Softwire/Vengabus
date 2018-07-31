import { AxiosWithSAS } from './AxiosWithSAS';

const util = require('util');
require('util.promisify').shim();


/*
    This class exists as our own wrapper around the equivalent Azure API object,
    so that we can make any appropriate improvements to its API.
    e.g. Converting everything to promises.  
*/
export class VengaServiceBusService {
    constructor(connectionString, apiRoot) {
        this.axiosWithSAS = new AxiosWithSAS(connectionString);
        this.csAPIroot = apiRoot;
        this.jsonConfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };
    }

    /**
     * Gets the details of all queues in the current namespace from the server.
     * @return {object} The queues returned by the server.
     */
    listQueues = () => {
        const url = this.csAPIroot + 'queues/list';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of a particular queue.
     * @param {string} queueName The name of the queue to get details for.
     * @return {object} The queues returned by the server.
     */
    getQueueDetails = (queueName) => {
        const url = this.csAPIroot + 'queues/details/' + queueName;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all topics in the current namespace from the server.
     * @return {object} The queue returned by the server.
     */
    listTopics = () => {
        const url = this.csAPIroot + 'topics/list';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of a particular topic.
     * @param {string} topicName The name of the topic to get details for.
     * @return {object} The topic returned by the server.
     */
    getTopicDetails = (topicName) => {
        const url = this.csAPIroot + 'topics/details/' + topicName;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all subscriptions in a given topic from the server.
     * @param {string} topicName The name of the topic to get subscriptions from.
     * @return {object} The subsctiptions returned by the server.
     */
    listSubscriptions = (topicName) => {
        const url = this.csAPIroot + 'subscriptions/list/' + topicName;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of a particular topic.
     * @param {string} parentTopicName The name of the parent topic for the subscription.
     * @param {string} subscriptionName The name of the subscription to get details for.
     * @return {object} The topic returned by the server.
     */
    getSubscriptionDetails = (parentTopicName, subscriptionName) => {
        const url = this.csAPIroot + 'subscriptions/details/' + parentTopicName + '/' + subscriptionName;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Sends a message to the given queue on the server.
     * @param {string} queueName The name of the queue to send the message to.
     * @param {object} message The message to send to the queue, in the format:
     * {
     *   "messageProperties": {},
     *   "messageBody": "string",
     *   "messageId": "string",
     *   "contentType": "string"
     * }
     */
    sendMessageToQueue = (queueName, message) => {
        const url = this.csAPIroot + 'messages/send/queue/' + queueName;
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, message, config);
    }

    /**
     * Sends a message to the given topic on the server.
     * @param {string} topicName The name of the topic to send the message to.
     * @param {object} message The message to send to the queue, in the format:
     * {
     *   "messageProperties": {},
     *   "messageBody": "string",
     *   "messageId": "string",
     *   "contentType": "string"
     * }
     */
    sendMessageToTopic = (topicName, message) => {
        const url = this.csAPIroot + 'messages/send/topic/' + topicName;
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        this.axiosWithSAS.post(url, message, config);
    }

    deleteQueueMessages = (queueName) => {
        const url = this.csAPIroot + `messages/queue/${queueName}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteTopicMessages = (topicName) => {
        const url = this.csAPIroot + `messages/topic/${topicName}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteSubscriptionMessages = (topicName, subscriptionName) => {
        const url = this.csAPIroot + `messages/subscription/${topicName}/${subscriptionName}`;
        return this.axiosWithSAS.delete(url);
    }

    // QQ Fetch from API once endpoint exists
    /**
     * Returns the pre-defined properties that are allowed to be added to messages.
     * @returns {string[]} The allowed properties.
     */
    getPermittedMessageProperties = () => {
        return new Promise(function (resolve, reject) {
            resolve(['MessageId', 'ContentType']);
        });
    }

    // QQ
    // Update this when the API is working
    static getServiceBusProperties(connectionString) {
        return new Promise(function (resolve, reject) {
            resolve({
                name: 'name ex',
                status: 'true',
                location: 'uk?',
                permission: 'all'
            });
            // reject('err');
        });
    }

    // QQ
    // Update this when the API is working, once the actual form of the response is know it will have to be transformed
    // to a format which can be displayed by the BootstrapTable component (like in the hard coded example below)
    getAllQueues = () => {
        return new Promise((resolve, reject) => {
            const data = [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }];
            resolve(data);
        });
    };


}
