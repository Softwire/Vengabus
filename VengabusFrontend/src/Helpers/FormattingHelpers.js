import moment from 'moment';

export function DateTimeToString(date){ 
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
}