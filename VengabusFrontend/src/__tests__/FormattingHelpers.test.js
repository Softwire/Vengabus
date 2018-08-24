import { parseTimeSpanFromBackend } from '../Helpers/FormattingHelpers';

describe('parseTimeSpanFromBackend', () => {

    it('formats timespan correctly', () => {
        const timespanFromBackend = '110.02:48:05.4780000';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expect(parsedTimespan.days).toBe(110);
        expect(parsedTimespan.hours).toBe(2);
        expect(parsedTimespan.minutes).toBe(48);
        expect(parsedTimespan.seconds).toBe(5);
        expect(parsedTimespan.milliseconds).toBe(478);
    });

    it('formats timespan correctly when some of the values are 0', () => {
        const timespanFromBackend = '110.00:48:00.0000000';
        const parsedTimespan = parseTimeSpanFromBackend(timespanFromBackend);
        expect(parsedTimespan.days).toBe(110);
        expect(parsedTimespan.hours).toBe(0);
        expect(parsedTimespan.minutes).toBe(48);
        expect(parsedTimespan.seconds).toBe(0);
        expect(parsedTimespan.milliseconds).toBe(0);
    });

});