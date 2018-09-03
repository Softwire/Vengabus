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

export function parseUploadedMessage(message) {
    const messageUploaded = {
        predefinedProperties: { ...message },
        customProperties: { ...message.properties },
        messageBody: message.body
    };
    delete messageUploaded.predefinedProperties.body;
    delete messageUploaded.predefinedProperties.properties;

    return messageUploaded;
}

export function formatMessageForDownload(message) {
    const messageDownload = {
        // Note that we don't spread the core of the message, as all the properties on there are note form the API - they are temporary data added after the fact.
        ...message.predefinedProperties,
        properties: { ...message.customProperties },
        body: message.messageBody
    };

    delete messageDownload.predefinedProperties;
    delete messageDownload.customProperties;

    return messageDownload;
}

/**
 * @param {string} timespan As received from the backend.
 * @returns {object} Timespan object in that has properties: days, hours, minutes, seconds, milliseconds.
 */
export function parseTimeSpanFromBackend(timespan) { //qqMDM aim to make this obsolete
    const momentDuration = moment.duration(timespan);
    const days = Math.floor(momentDuration.asDays());
    let result = momentDuration._data;
    delete result.years;
    delete result.months;
    result.days = days;
    return result;
}

export function jsonToString(json) {
    const replacer = null;
    const spacing = 4;
    return JSON.stringify(json, replacer, spacing);

}

