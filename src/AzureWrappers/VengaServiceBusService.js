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
        this.rawService = azure.createServiceBusService(
            'Endpoint=sb://vengabusdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a8sPg0N79mgTNAfM57b7kwWsBCPK8TW7hwTwyexlK+8='
        );
        /*let client = this.rawService;
         setTimeout(() => {
            client.listTopics((error, response) => {
                if (error) {
                    console.log(2);
                    console.log(error);
                    return;
                }
                console.log(1);
                console.log(response);
            });
        }, 2000);*/
    }

    /* Note that the lamda here captures `this` = the VengaServiceBusService, to access rawService.
       But it also captures `rawService` as the callee of getQueue (and hence, the value of `this` INSIDE the getQueue method)*/
    getQueue = util.promisify((queueName, callback) => this.rawService.getQueue(queueName, callback));


   static getConnectingStringMetaData(connectionString) { 
        return new Promise(function (resolve, reject) {
            resolve(
                {
                    name: "name ex",
                    status: "true",
                    location: "uk?",
                    permission: "all"
                }
            );
            reject('err');
        });
    }

    // QQ
    // Update this when the API is working
    getAllQueues = () => {
        return new Promise((resolve, reject) => {
            const data = [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }];
            resolve(data);
        });
    };
}



