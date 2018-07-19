import { VengaServiceBusService } from './VengaServiceBusService';

class ServiceBusConnection {
    constructor() {
        this.activeServiceBusConString = '';
        this.activeAPIroot = '';
        this.activeQueueName = '';
    }

    /**
     * Updates the Azure connection string used to connect to the service bus.
     * @param {string} newConnectionString The new connection string to use.
     */
    setConnectionString = (newConnectionString) => {
        this.activeServiceBusConString = newConnectionString;
    };

    /**
     * Updates the location of the API backend to be used by the ServiceBusConnection.
     * @param {string} newURI The new API root URI to use.
     */
    setAPIroot = (newURI) => {
        this.activeAPIroot = newURI;
    };

    setQueueName = (newQueueName) => {
        this.activeQueueName = newQueueName;
    };

    /**
     * Returns a VengaServiceBusService that uses the current connection string and API root location.
     * @return {VengaServiceBusService} The VengaServiceBusService defined by the settings in this object.
     */
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
