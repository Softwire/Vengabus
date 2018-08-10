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
        const url = this.apiRoot + 'queues';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of a particular queue.
     * @param {string} queueName The name of the queue to get details for.
     * @return {object} The queues returned by the server.
     */
    getQueueDetails = (queueName) => {
        const url = this.apiRoot + `queues/${queueName}`;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all topics in the current namespace from the server.
     * @return {object} The queue returned by the server.
     */
    listTopics = () => {
        const url = this.apiRoot + 'topics';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of a particular topic.
     * @param {string} topicName The name of the topic to get details for.
     * @return {object} The topic returned by the server.
     */
    getTopicDetails = (topicName) => {
        const url = this.apiRoot + `topics/${topicName}`;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all subscriptions in a given topic from the server.
     * @param {string} topicName The name of the topic to get subscriptions from.
     * @return {object} The subsctiptions returned by the server.
     */
    listSubscriptions = (topicName) => {
        const url = this.apiRoot + `subscriptions/${topicName}`;
        return this.axiosWithSAS.get(url);
    }


    /**
     * Gets the details of a particular topic.
     * @param {string} parentTopicName The name of the parent topic for the subscription.
     * @param {string} subscriptionName The name of the subscription to get details for.
     * @return {object} The topic returned by the server.
     */
    getSubscriptionDetails = (parentTopicName, subscriptionName) => {
        const url = this.apiRoot + `subscriptions/${parentTopicName}/${subscriptionName}`;
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
        const url = this.apiRoot + `queues/${queueName}/messages`;
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
        const url = this.apiRoot + `topics/${topicName}/messages`;
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, message, config);
    }

    purgeQueueMessages = (queueName) => {
        const url = this.apiRoot + `queues/${queueName}/messages`;
        return this.axiosWithSAS.delete(url);
    }

<<<<<<< HEAD
    purgeTopicMessages = (topicName) => {
=======
    deleteQueueSingleMessage = (queueName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `queues/${queueName}/message/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteQueueSingleDeadLetterMessage = (queueName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `queues/${queueName}/deadletter/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteTopicMessages = (topicName) => {
>>>>>>> Add methods for calling deleting single message endpoints
        const url = this.apiRoot + `topics/${topicName}/messages`;
        return this.axiosWithSAS.delete(url);
    }

<<<<<<< HEAD
    purgeSubscriptionMessages = (topicName, subscriptionName) => {
=======
    deleteTopicSingleMessage = (topicName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `topics/${topicName}/message/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteSubscriptionMessages = (topicName, subscriptionName) => {
>>>>>>> Add methods for calling deleting single message endpoints
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/messages`;
        return this.axiosWithSAS.delete(url);
    }

    deleteSubscriptionSingleMessage = (topicName, subscriptionName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/message/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteSubscriptionSingleDeadLetterMessage = (topicName, subscriptionName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/deadletter/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    listQueueMessages = (queueName) => {
        const url = this.apiRoot + `queues/${queueName}/messages`;
        return this.axiosWithSAS.get(url);
    }

    listSubscriptionMessages = (topicName, subscriptionName) => {
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/messages`;
        return this.axiosWithSAS.get(url);
    }


    listQueueDeadLetterMessages = (queueName) => {
        const url = this.apiRoot + `queues/${queueName}/deadletters`;
        return this.axiosWithSAS.get(url);
    }

    listSubscriptionDeadLetterMessages = (topicName, subscriptionName) => {
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/deadletters`;
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
}
