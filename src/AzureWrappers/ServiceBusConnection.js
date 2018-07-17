import { VengaServiceBusService } from './VengaServiceBusService';

class ServiceBusConnection {
    constructor() {
        this.activeServiceBusConString = '';
        this.activeQueueName = '';
    }

    setConnectionString = (newConnectionString) => {
        this.activeServiceBusConString = newConnectionString;
    };

    setQueueName = (newQueueName) => {
        this.activeQueueName = newQueueName;
    };

    getServiceBusService = () => {
        try {
            return new VengaServiceBusService(this.activeServiceBusConString);
        } catch (err) {
            console.log(err);
            throw err;
        }
    };
}
export const serviceBusConnection = new ServiceBusConnection();
