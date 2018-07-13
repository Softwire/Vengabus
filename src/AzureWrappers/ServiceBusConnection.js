import { VengaServiceBusService } from './VengaServiceBusService';

class ServiceBusConnection {
    constructor() {
        this.activeServiceBusConString = '';
        this.activeQueueName = '';
        this.useHardCodedDirectConString = true;
        this.useHardCodedIndirectConString = false;
    }

    setConnectionString = (newConnectionString) => {
        this.activeServiceBusConString = newConnectionString;
    };

    setQueueName = (newQueueName) => {
        this.activeQueueName = newQueueName;
    };

    getServiceBusService = () => {
        this.applyHardCodedOverrides();
        try {
            return new VengaServiceBusService(this.activeServiceBusConString);
        } catch (err) {
            console.log(err);
            throw err;
        }
    };

    applyHardCodedOverrides() {
        // Current temporary code, until we've setup sensible 'caching' of these values.
        // Override settings to point at known valid target:
        const directQueueName = 'DemoQueue1';

        // Further override settings to point at Rev.Proxy. target:
        const indirectConString =
            'Endpoint=sb://vengabusreverseproxy.azurewebsites.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a8sPg0N79mgTNAfM57b7kwWsBCPK8TW7hwTwyexlK+8=';
        const indirectQueueName = 'AzureApiProxy/' + directQueueName;

        if (this.useHardCodedDirectConString) {

            this.activeQueueName = directQueueName;
        }

        if (this.useHardCodedIndirectConString) {
            this.activeServiceBusConString = indirectConString;
            this.activeQueueName = indirectQueueName;
        }
    }
}
export const serviceBusConnection = new ServiceBusConnection();
