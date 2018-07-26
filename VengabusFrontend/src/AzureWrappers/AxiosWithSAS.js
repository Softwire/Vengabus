import axios from 'axios';
import moment from 'moment';
import crypto from 'crypto';


/**
 * Provides methods to interact with the api using an SAS token for authentication.
 */
export default class AxiosWithSAS {
    /**
     * @param {string} connectionString The connection string of the server to connect to.
     */
    constructor(connectionString) {
        this.connectionString = connectionString;
    }

    /**
     * Performs a GET request after being passed a url, with the appropriate SAS header.
     * @param {string} url The url that the get request should be sent to.
     * @param {string} config An axios config that is used in the axios request in addition to the SAS authentication.
     * @returns {Promise} The Promise returned by the axios request.
     */
    get = (url, config) => {
        const token = this.getTokenFromConnectionString();
        const sasConfig = this.addAuthToConfig(config, token);
        return axios.get(url, sasConfig);
    }

    /**
     * Performs a DELETE request after being passed a url, with the appropriate SAS header.
     * @param {string} url The url that the get request should be sent to.
     * @param {string} config An axios config that is used in the axios request in addition to the SAS authentication.
     * @returns {Promise} The Promise returned by the axios request.
     */
    delete = (url, config) => {
        const token = this.getTokenFromConnectionString();
        const sasConfig = this.addAuthToConfig(config, token);
        return axios.delete(url, sasConfig);
    }

    /**
     * Performs a PUSH request after being passed a url, with the appropriate SAS header.
     * @param {string} url The url that the get request should be sent to.
     * @param {string} config An axios config that is used in the axios request in addition to the SAS authentication.
     * @returns {Promise} The Promise returned by the axios request.
     */
    push = (url, config) => {
        const token = this.getTokenFromConnectionString();
        const sasConfig = this.addAuthToConfig(config, token);
        return axios.push(url, sasConfig);
    }

    /**
     * Returns an SAS token valid for 1 hour based on the stored connectionString.
     * @returns {object} The SAS token.
     */
    getTokenFromConnectionString() {
        const connectionArray = this.connectionString.split(';');
        let endPoint, sharedAccessKeyName, sharedAccessKey;

        for (let i = 0; i < connectionArray.length; i++) {
            const currentSection = connectionArray[i];

            if (currentSection.startsWith('Endpoint=')) {
                endPoint = 'https:/' + currentSection.slice(13);
            }
            if (currentSection.startsWith('SharedAccessKeyName=')) {
                sharedAccessKeyName = currentSection.slice(20);
            }
            if (currentSection.startsWith('SharedAccessKey=')) {
                sharedAccessKey = currentSection.slice(16);
            }
        }
        return this.createSasToken(endPoint, sharedAccessKeyName, sharedAccessKey);
    }

    /**
     * Generates an SAS token from a given uri, key name, and key.
     * @param {string} uri The URI of the azure service bus.
     * @param {string} keyName The name of the key used to connect to the server, usually "RootManageSharedAccessKey"
     * @param {string} key The key used to connect to the server.
     * @returns {object} The SAS token, valid for 1 hour.
     */
    createSasToken(uri, keyName, key) {
        // Token expires in one hour
        const expiry = moment().add(1, 'hours').unix();

        const string_to_sign = encodeURIComponent(uri) + '\n' + expiry;
        var hmac = crypto.createHmac('sha256', key);
        hmac.update(string_to_sign);
        const signature = hmac.digest('base64');
        const token = 'SharedAccessSignature sr=' + encodeURIComponent(uri) + '&sig=' + encodeURIComponent(signature) + '&se=' + expiry + '&skn=' + keyName;

        return token;
    }

    /**
     * Adds the given SAS token to the headers of the given axios config.
     * @param {object} config The existing axios config.
     * @param {object} token The SAS token to be put in the headers.
     * @returns {object} The config object.
     */
    addAuthToConfig(config, token) {
        const extendedConfig = config || {};
        extendedConfig.headers = extendedConfig.headers || {};
        extendedConfig.headers["Auth-SAS"] = token;
        return extendedConfig;
    }


}