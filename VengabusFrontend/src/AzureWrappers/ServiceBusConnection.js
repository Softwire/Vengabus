import { VengaServiceBusService } from './VengaServiceBusService';

class ServiceBusConnection {
    constructor() {
        this.activeServiceBusConString = '';
        this.activeAPIroot = '';
        this.activeQueueName = '';
    }

    setConnectionString = (newConnectionString) => {
        this.activeServiceBusConString = newConnectionString;
    };

    setAPIroot = (newURI) => {
        this.activeAPIroot = newURI;
    };

    setQueueName = (newQueueName) => {
        this.activeQueueName = newQueueName;
    };

    getServiceBusService = () => {
        try {
            return new VengaServiceBusService(this.activeServiceBusConString, this.activeAPIroot);
        } catch (err) {
            console.log(err);
            throw err;
        }
    };
}
export const serviceBusConnection = new ServiceBusConnection();
