import { VengaServiceBusService } from './VengaServiceBusService';

class ServiceBusConnection {
    constructor() {
        this.activeServiceBusConString = '';
        this.activeAPIroot = '';
    }

    /**
     * Updates the Azure connection string used to connect to the service bus.
     * @param {string} newConnectionString The new connection string to use.
     * Should be in the format generated by the Azure portal:
     * Endpoint=sb://<EndpointLocation>/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<SharedAccessKey>
     * e.g.
     * Endpoint=sb://vengabusdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SGd6kBFkdDBGKs5FIBSgibSgSG5dsUBGS+8=
     */
    setConnectionString = (newConnectionString) => {
        this.activeServiceBusConString = newConnectionString;
    };

    /**
     * Updates the location of the API backend to be used by the ServiceBusConnection.
     * http:// and a trailing slash will be added if omitted.
     * @param {string} newURI The new API root URI to use.
     */
    setApiRoot = (newURI) => {
        this.activeAPIroot = this.formatApiRootString(newURI);
    };

    /**
     * Takes a string and prepends http:// and adds a trailing slash if not already present.
     * @param {string} APIRootString The string to format.
     * @return {string} The formatted string.
     */
    formatApiRootString = (APIRootString) => {
        if (!APIRootString.startsWith("http")) { //Catches both http and https cases
            APIRootString = "http://" + APIRootString;
        }
        if (!APIRootString.endsWith("/")) {
            APIRootString = APIRootString + "/";
        }
        return APIRootString;
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
