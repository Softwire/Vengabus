let azure = require('azure-sb');

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
            let serviceBusService = azure.createServiceBusService(this.activeServiceBusConString);
            return serviceBusService;
        } catch (err) {
            console.log(err);
            return;
        }
    };

    applyHardCodedOverrides() {
        // Current temporary code, until we've setup sensible 'caching' of these values.
        // Override settings to point at known valid target:
        let directConString =
            'Endpoint=sb://vengabusdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a8sPg0N79mgTNAfM57b7kwWsBCPK8TW7hwTwyexlK+8=';
        let directQueueName = 'DemoQueue1';

        // Further override settings to point at Rev.Proxy. target:
        let indirectConString =
            'Endpoint=sb://vengabusreverseproxy.azurewebsites.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a8sPg0N79mgTNAfM57b7kwWsBCPK8TW7hwTwyexlK+8=';
        let indirectQueueName = 'AzureApiProxy/' + directQueueName;

        if (this.useHardCodedDirectConString) {
            this.activeServiceBusConString = directConString;
            this.activeQueueName = directQueueName;
        }

        if (this.useHardCodedIndirectConString) {
            this.activeServiceBusConString = indirectConString;
            this.activeQueueName = indirectQueueName;
        }
    }
}
export const serviceBusConnection = new ServiceBusConnection();
