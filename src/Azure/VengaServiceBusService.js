let azure = require('azure-sb');
let util = require('util');
require('util.promisify').shim();

/*
    This class exists as our own wrapper around the equivalent Azure API object,
    so that we can make any appropriate improvements to it's API.
    e.g.
    Converting everything to promises.
*/
export class VengaServiceBusService {
    constructor(connectionString) {
        this.rawService = azure.createServiceBusService(connectionString);
    }

    getQueue = util.promisify((queueName, callback) => this.rawService.getQueue(queueName, callback));
}
