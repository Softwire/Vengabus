import { resolve } from 'path';
import { rejects } from 'assert';

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
    constructor(connectionString) {
        this.rawService = azure.createServiceBusService(connectionString);
    }

    /* Note that the lamda here captures `this` = the VengaServiceBusService, to access rawService.
       But it also captures `rawService` as the callee of getQueue (and hence, the value of `this` INSIDE the getQueue method)*/
    getQueue = util.promisify((queueName, callback) => this.rawService.getQueue(queueName, callback));

    static getServiceBusProperties(connectionString) {
        return new Promise(function(resolve, reject) {
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
