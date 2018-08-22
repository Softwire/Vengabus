import moment from 'moment';

export function formatTimeStamp(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

export function formatMessageForDownload(message) {
    let messageDownload = { ...message, ...message.predefinedProperties };
    delete messageDownload.predefinedProperties;

    messageDownload.properties = { ...message.customProperties };
    delete messageDownload.customProperties;

    messageDownload.body = messageDownload.messageBody;
    delete messageDownload.messageBody;
    delete messageDownload.messageBodyPreview;

    delete messageDownload.timestamp;
    delete messageDownload.uniqueId;

    return messageDownload;
}}

/**
 * @param {string} timespan As received from the backend.
 * @returns {object} Timespan object in that has properties: days, hours, minutes, seconds, milliseconds.
 */
export function parseTimeSpanFromBackend(timespan) {
    const momentDuration = moment.duration(timespan);
    const days = Math.floor(momentDuration.asDays());
    let result = momentDuration._data;
    delete result.years;
    delete result.months;
    result.days = days;
    return result;
}