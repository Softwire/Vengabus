const azure = require('azure-sb');
const util = require('util');
require('util.promisify').shim();

/*
    This class exists as our own wrapper around the equivalent Azure API object,
    so that we can make any appropriate improvements to it's API.
    e.g. Converting everything to promises.  
*/
export class VengaServiceBusService {
    constructor(connectionString) {
        this.rawService = azure.createServiceBusService(connectionString);
    }

    /* Note that the lamda here captures `this` = the VengaServiceBusService, to access rawService.
       But it also captures `rawService` as the callee of getQueue (and hence, the value of `this` INSIDE the getQueue method)*/
    getQueue = util.promisify((queueName, callback) => this.rawService.getQueue(queueName, callback));
}
