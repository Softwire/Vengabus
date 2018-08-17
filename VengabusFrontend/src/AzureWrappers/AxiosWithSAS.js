import axios from 'axios';
import moment from 'moment';
import crypto from 'crypto';
import { NotificationManager } from 'react-notifications';



/**
 * Provides methods to interact with the api using an SAS token for authentication.
 */
export class AxiosWithSAS {
    /**
     * @param {string} connectionString The connection string of the server to connect to.
     */
    constructor(connectionString) {
        this.connectionString = connectionString;
    }
    /**
     * Handle the errors coming from Axios.
     * @param error the error object returned by Axios
     */

    errorHandler = (error) => {
        console.log(error.response);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            this.errorNotificationPopup(error.response.status + " " + error.response.statusText + ": " + error.response.data.exceptionMessage);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            if (error.request.status === 0) {
                this.errorNotificationPopup("Backend is offline!");
            } else {
                this.errorNotificationPopup(error.request.status + " " + error.request.statusText);
            }
        } else {
            // Something happened in setting up the request that triggered an Error
            this.errorNotificationPopup(error.message);
        }
        throw error;
    }

    errorNotificationPopup(message) {
        NotificationManager.error(message, "Error", 5000);
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
        return axios.get(url, sasConfig)
            .then((result) => { return result.data; })
            .catch(this.errorHandler);
    }

    /**
     * Performs a DELETE request after being passed a url, with the appropriate SAS header.
     * @param {string} url The url that the get request should be sent to.
     * @param {object} config An axios config that is used in the axios request in addition to the SAS authentication.
     * @returns {Promise} The Promise returned by the axios request.
     */
    delete = (url, config) => {
        const token = this.getTokenFromConnectionString();
        const sasConfig = this.addAuthToConfig(config, token);
        return axios.delete(url, sasConfig).then((result) => {
            return result.data;
        }).catch(this.errorHandler);
    }

    /**
     * Performs a POST request after being passed a url, with the appropriate SAS header.
     * @param {string} url The url that the get request should be sent to.
     * @param {object} body The body of the request.
     * @param {object} config An axios config that is used in the axios request in addition to the SAS authentication.
     * @returns {Promise} The Promise returned by the axios request.
     */
    post = (url, body, config) => {
        const token = this.getTokenFromConnectionString();
        const sasConfig = this.addAuthToConfig(config, token);
        return axios.post(url, body, sasConfig).then((result) => {
            return result.data;
        }).catch(this.errorHandler);
    }

    /**
     * Returns an SAS token valid for 1 hour based on the stored connectionString.
     * @returns {object} The SAS token.
     */
    getTokenFromConnectionString() {
        const connectionArray = this.connectionString.split(';');
        let endPoint = '', sharedAccessKeyName = '', sharedAccessKey = '';

        for (let i = 0; i < connectionArray.length; i++) {
            const EndpointLabel = 'Endpoint=sb://';
            const KeyNameLabel = 'SharedAccessKeyName=';
            const KeyLabel = 'SharedAccessKey=';
            const currentSection = connectionArray[i];

            if (currentSection.startsWith(EndpointLabel)) {
                endPoint = 'https://' + currentSection.slice(EndpointLabel.length);
            }
            if (currentSection.startsWith(KeyNameLabel)) {
                sharedAccessKeyName = currentSection.slice(KeyNameLabel.length);
            }
            if (currentSection.startsWith(KeyLabel)) {
                sharedAccessKey = currentSection.slice(KeyLabel.length);
            }
        }
        return this.createSasToken(endPoint, sharedAccessKeyName, sharedAccessKey);
    }

    /**
     * Generates an SAS token from a given uri, key name, and key.
     * @param {string} uri The URI of the azure service bus.
     * @param {string} keyName The name of the key used to connect to the server, usually "RootManageSharedAccessKey"
     * @param {string} key The key used to connect to the server.
     * @returns {object} The SAS token, valid for 1 minute.
     */
    createSasToken(uri, keyName, key) {
        // Token expires in one minute. A new token is created for each request, so a minute is plenty.
        const expiry = moment().add(1, 'minutes').unix();

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