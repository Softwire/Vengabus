import { AxiosWithSAS } from './AxiosWithSAS';
require('util.promisify').shim();

/*
    This class exists as our own wrapper around the equivalent Azure API object,
    so that we can make any appropriate improvements to its API.
    e.g. Converting everything to promises.  
*/
export class VengaServiceBusService {
    constructor(connectionString, apiRoot) {
        this.axiosWithSAS = new AxiosWithSAS(connectionString);
        this.apiRoot = apiRoot;
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
        const url = this.apiRoot + 'queues/list';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of a particular queue.
     * @param {string} queueName The name of the queue to get details for.
     * @return {object} The queues returned by the server.
     */
    getQueueDetails = (queueName) => {
        const url = this.apiRoot + 'queues/details/' + queueName;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all topics in the current namespace from the server.
     * @return {object} The queue returned by the server.
     */
    listTopics = () => {
        const url = this.apiRoot + 'topics/list';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of a particular topic.
     * @param {string} topicName The name of the topic to get details for.
     * @return {object} The topic returned by the server.
     */
    getTopicDetails = (topicName) => {
        const url = this.apiRoot + 'topics/details/' + topicName;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all subscriptions in a given topic from the server.
     * @param {string} topicName The name of the topic to get subscriptions from.
     * @return {object} The subsctiptions returned by the server.
     */
    listSubscriptions = (topicName) => {
        const url = this.apiRoot + 'subscriptions/list/' + topicName;
        return this.axiosWithSAS.get(url);
    }


    /**
     * Gets the details of a particular topic.
     * @param {string} parentTopicName The name of the parent topic for the subscription.
     * @param {string} subscriptionName The name of the subscription to get details for.
     * @return {object} The topic returned by the server.
     */
    getSubscriptionDetails = (parentTopicName, subscriptionName) => {
        const url = this.apiRoot + 'subscriptions/details/' + parentTopicName + '/' + subscriptionName;
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
        const url = this.apiRoot + 'messages/send/queue/' + queueName;
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
        const url = this.apiRoot + 'messages/send/topic/' + topicName;
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        this.axiosWithSAS.post(url, message, config);
    }

    deleteQueueMessages = (queueName) => {
        const url = this.apiRoot + `messages/queue/${queueName}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteTopicMessages = (topicName) => {
        const url = this.apiRoot + `messages/topic/${topicName}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteSubscriptionMessages = (topicName, subscriptionName) => {
        const url = this.apiRoot + `messages/subscription/${topicName}/${subscriptionName}`;
        return this.axiosWithSAS.delete(url);
    }

    listQueueMessages = (queueName) => {
        const url = this.apiRoot + `messages/list/queue/${queueName}`;
        return this.axiosWithSAS.get(url);
    }

    listSubscriptionMessages = (topicName, subscriptionName) => {
        const url = this.apiRoot + `messages/list/subscription/${topicName}/${subscriptionName}`;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Returns the pre-defined properties that can be read from messages.
     * @returns {string[]} The available properties.
     */
    getReadableMessageProperties = () => {
        const url = this.apiRoot + 'messages/properties/readable';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Returns the pre-defined properties that can be set to messages.
     * @returns {string[]} The allowed properties.
     */
    getWriteableMessageProperties = () => {
        const url = this.apiRoot + 'messages/properties/writeable';
        return this.axiosWithSAS.get(url);
    }

    // QQ
    // Update this when the API is working
    getServiceBusProperties() {
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
}
