import moment from 'moment';

export function formatTimeStamp(date) {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
}