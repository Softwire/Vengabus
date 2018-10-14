import moment from 'moment';

export function formatTimeStamp(date) {
    if (date) {
        return moment(date).format("DD-MM-YYYY HH:mm:ss");
    }
    return null;
}

export function formatDeadletterTimeStamp(date) {
    return formatTimeStamp(date) || 'No Deadletters';
}

/*
 * API Message: {
 *   predefinedProperties: object of key-value pairs of Microsoft fundamental message properties
 *   customProperties: object of key-value pairs, defined by System users.
 *   messageBody: Arbitrary string
 *   <other fields directly on message>: misc meta data attached after download.
 * }
 *
 * File Message: {
 *   <fields directly on message>: key-value pairs of Microsoft fundamental message properties
 *   properties: object of key-value pairs, defined by System users.
 *   body: Arbitrary string
 * }
 */

/**
 * @param {Object} apiMessage Message object in our API's format.
 * @returns {Object} Message object in the written-to-disk format.
 */
export function formatMessageForDownload(apiMessage) {
    // Note that we don't spread the core of the message, as all the properties on there
    // are not from the API - they are temporary data added after we received the object.
    // This has the side benefit of meaning that we don't need to 'cleanup' our object.    
    const fileMessageToDownload = {
        ...apiMessage.predefinedProperties,
        properties: { ...apiMessage.customProperties },
        body: apiMessage.messageBody
    };

    return fileMessageToDownload;
}

/**
 * @param {Object} fileMessage Message object in the written-to-disk format.
 * @returns {Object} Message object in our API's format.
 */
export function parseUploadedMessage(fileMessage) {
    const messageUploadedInApiFormat = {
        predefinedProperties: { ...fileMessage },
        customProperties: { ...fileMessage.properties },
        messageBody: fileMessage.body
    };
    delete messageUploadedInApiFormat.predefinedProperties.body;
    delete messageUploadedInApiFormat.predefinedProperties.properties;

    return messageUploadedInApiFormat;
}

export function jsonToFormattedString(json) {
    const replacer = null;
    const spacing = 4;
    return JSON.stringify(json, replacer, spacing);
}
