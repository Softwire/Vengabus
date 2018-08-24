import { parseTimeSpanFromBackend } from '../Helpers/FormattingHelpers';

describe('parseTimeSpanFromBackend', () => {

    function expectObject(timespanObject, days, hours, minutes, seconds, milliseconds) {
        expect(timespanObject.days).toBe(days);
        expect(timespanObject.hours).toBe(hours);
        expect(timespanObject.minutes).toBe(minutes);
        expect(timespanObject.seconds).toBe(seconds);
        expect(timespanObject.milliseconds).toBe(milliseconds);
    }

    it('formats timespan correctly 1', () => {
        const timespanFromBackend = '110.02:48:05.4780000';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expectObject(parsedTimespan, 110, 2, 48, 5, 478);
    });

    it('formats timespan correctly 2', () => {
        const timespanFromBackend = '0.00:48:00.0000000';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expectObject(parsedTimespan, 0, 0, 48, 0, 0);
    });

    it('formats timespan correctly 3', () => {
        const timespanFromBackend = '110.00:48:00.';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expectObject(parsedTimespan, 110, 0, 48, 0, 0);
    });

    it('formats timespan correctly 4', () => {
        const timespanFromBackend = '110.00:48:00';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expectObject(parsedTimespan, 110, 0, 48, 0, 0);
    });

    it('formats timespan correctly 5', () => {
        const timespanFromBackend = '110.00:48';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expectObject(parsedTimespan, 110, 0, 48, 0, 0);
    });

    it('formats timespan correctly 6', () => {
        const timespanFromBackend = '.00:48:00.0000000';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expectObject(parsedTimespan, 0, 0, 48, 0, 0);
    });

    it('formats timespan correctly 7', () => {
        const timespanFromBackend = '00:48:00.0000000';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expectObject(parsedTimespan, 0, 0, 48, 0, 0);
    });

});