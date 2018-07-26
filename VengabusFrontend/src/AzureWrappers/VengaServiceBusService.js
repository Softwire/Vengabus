import AxiosWithSAS from './AxiosWithSAS';

const azure = require('azure-sb');
const util = require('util');
require('util.promisify').shim();

'use strict';

/*
    This class exists as our own wrapper around the equivalent Azure API object,
    so that we can make any appropriate improvements to its API.
    e.g. Converting everything to promises.  
*/
export class VengaServiceBusService {
    constructor(connectionString, apiRoot) {
        this.rawService = azure.createServiceBusService(connectionString);
        this.axiosWithSAS = new AxiosWithSAS(connectionString);
        this.csAPIroot = apiRoot;
    }



    /* Note that the lamda here captures `this` = the VengaServiceBusService, to access rawService.
       But it also captures `rawService` as the callee of getQueue (and hence, the value of `this` INSIDE the getQueue method)*/
    getQueue = util.promisify((queueName, callback) => this.rawService.getQueue(queueName, callback));

    /**
     * Gets the details of all queues in the current namespace from the server.
     * @return {object} The queues returned by the server.
     */
    listQueues = () => {
        const url = this.csAPIroot + 'queues/list';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all topics in the current namespace from the server.
     * @return {object} The topics returned by the server.
     */
    listTopics = () => {
        const url = this.csAPIroot + 'topics/list';
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all subscriptions in a given topic from the server.
     * @param {string} topicName The name of the topic to et subscriptions from.
     * @return {object} The subsctiptions returned by the server.
     */
    listSubscriptions = (topicName) => {
        const url = this.csAPIroot + 'subscriptions/list/' + topicName;
        return this.axiosWithSAS.get(url);
    }

    /**
     * Gets the details of all subscriptions in a given topic from the server.
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
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        this.axiosWithSAS.post(url, message, config);
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
