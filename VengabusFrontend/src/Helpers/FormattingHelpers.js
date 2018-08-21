import moment from 'moment';

export function formatTimeStamp(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

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