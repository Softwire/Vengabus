import { parseTimeSpanFromBacend } from '../Helpers/FormattingHelpers';

describe('parseTimeSpanFromBackend', () => {

    it('formats timespan correctly', () => {
        const timespanFromBackend = '110.02:48:05.4780000';
        const parsedTimespan = parseTimeSpanFromBacend(timespanFromBackend);
        expect(parsedTimespan.days).toBe(110);
        expect(parsedTimespan.hours).toBe(2);
        expect(parsedTimespan.minutes).toBe(48);
        expect(parsedTimespan.seconds).toBe(5);
        expect(parsedTimespan.milliseconds).toBe(478);
    });

});