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
     * Updates the properties of a queue
     * @param {object} queueDescription Object containing the new properties of the queue. It is specified in this which queue we are updating.
     * For more information on the form of this object see https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.queuedescription?view=azure-dotnet
     */
    updateQueue = (queueDescription) => {
        const url = this.apiRoot + 'queues/update';
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, queueDescription, config);
    }

    /**
     * Renames a queue
     * @param {string} oldName The original name of the queue.
     * @param {string} newName The new name of the queue.
     */
    renameQueue = (oldName, newName) => {
        const url = this.apiRoot + 'queues/rename';
        const config = this.jsonConfig;
        const names = {
            oldName: oldName,
            newName: newName
        };
        this.axiosWithSAS.post(url, names, config);
    }

    /**
     * Deletes a queue
     * @param {string} name Name of the queue to be deleted.
     */
    deleteQueue = (name) => {
        const url = this.apiRoot + 'queues/delete/' + name;
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, null, config);
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
     * Updates the properties of a queue
     * @param {object} topicDescription Object containing the new properties of the topic. It is specified in this which topic we are updating.
     * For more information on the form of this object see https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.topicdescription?view=azure-dotnet
     */
    updateTopic = (topicDescription) => {
        const url = this.apiRoot + 'topics/update';
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, topicDescription, config);
    }

    /**
     * Renames a topic
     * @param {string} oldName The original name of the topic.
     * @param {string} newName The new name of the topic.
     */
    renameTopic = (oldName, newName) => {
        const url = this.apiRoot + 'topics/rename';
        const config = this.jsonConfig;
        const names = {
            oldName: oldName,
            newName: newName
        };
        this.axiosWithSAS.post(url, names, config);
    }

    /**
     * Deletes a topic
     * @param {string} name Name of the topic to be deleted.
     */
    deleteTopic = (name) => {
        const url = this.apiRoot + 'topics/delete/' + name;
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, null, config);
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
     * Updates the properties of a subscription
     * @param {object} subDescription Object containing the new properties of the subscription. It is specified in this which subscription we are updating.
     * For more information on the form of this object see https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.subscriptiondescription?view=azure-dotnet
     */
    updateSubscription = (subDescription) => {
        const url = this.apiRoot + 'subscriptions/update';
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, subDescription, config);
    }

    /**
     * Deletes a subscription
     * @param {string} name Name of the subscription to be deleted.
     * @param {string} parentTopic Name of the paretn topic of the subscription.
     */
    deleteSubscription = (name, parentTopic) => {
        const url = this.apiRoot + 'subscriptions/delete/' + name;
        const config = this.jsonConfig;
        this.axiosWithSAS.post(url, parentTopic, config);
    }

    /**
     * Sends a message to the given queue on the server.
     * @param {string} queueName The name of the queue to send the message to.
     * @param {object} message The message to send to the queue, in the format:
     * {
     *      "customProperties": {},
     *      "predefinedProperties": {},
     *      "messageBody": "string"
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
     *      "customProperties": {},
     *      "predefinedProperties": {},
     *      "messageBody": "string"
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

    deleteQueueSingleMessage = (queueName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `queues/${queueName}/messages/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteQueueSingleDeadLetterMessage = (queueName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `queues/${queueName}/deadletters/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    purgeTopicMessages = (topicName) => {
        const url = this.apiRoot + `topics/${topicName}/messages`;
        return this.axiosWithSAS.delete(url);
    }

    deleteTopicSingleMessage = (topicName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `topics/${topicName}/messages/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    purgeSubscriptionMessages = (topicName, subscriptionName) => {
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/messages`;
        return this.axiosWithSAS.delete(url);
    }

    deleteSubscriptionSingleMessage = (topicName, subscriptionName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/messages/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    deleteSubscriptionSingleDeadLetterMessage = (topicName, subscriptionName, messageId, uniqueId) => {
        const messageIdEncoded = encodeURIComponent(messageId);
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/deadletters/${uniqueId}?messageId=${messageIdEncoded}`;
        return this.axiosWithSAS.delete(url);
    }

    listQueueMessages = (queueName, messageCount) => {
        let queryString = "";
        if (messageCount) {
            queryString = "/?messageCount=" + messageCount;
        }
        const url = this.apiRoot + `queues/${queueName}/messages` + queryString;
        return this.axiosWithSAS.get(url);
    }

    listSubscriptionMessages = (topicName, subscriptionName, messageCount) => {
        let queryString = "";
        if (messageCount) {
            queryString = "/?messageCount=" + messageCount;
        }
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/messages` + queryString;
        return this.axiosWithSAS.get(url);
    }


    listQueueDeadLetterMessages = (queueName, messageCount) => {
        let queryString = "";
        if (messageCount) {
            queryString = "/?messageCount=" + messageCount;
        }
        const url = this.apiRoot + `queues/${queueName}/deadletters` + queryString;
        return this.axiosWithSAS.get(url);
    }

    listSubscriptionDeadLetterMessages = (topicName, subscriptionName, messageCount) => {
        let queryString = "";
        if (messageCount) {
            queryString = "/?messageCount=" + messageCount;
        }
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/deadletters` + queryString;
        return this.axiosWithSAS.get(url);
    }

    getQueueMostRecentDeadletter = (queueName) => {
        const url = this.apiRoot + `queues/${queueName}/mostRecentDeadletter`;
        return this.axiosWithSAS.get(url);
    }

    getSubscriptionMostRecentDeadletter = (topicName, subscriptionName) => {
        const url = this.apiRoot + `subscriptions/${topicName}/${subscriptionName}/mostRecentDeadletter`;
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
