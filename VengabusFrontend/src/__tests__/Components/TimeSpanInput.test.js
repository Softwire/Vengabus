import React from 'react';
import { TimeSpanInput } from '../../Components/TimeSpanInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const data = {
        days: 30,
        hours: 12,
        minutes: 45,
        seconds: 5,
        milliseconds: 0
    };
    const tooltip =
        <Tooltip id="tooltip">
            Test tooltip.
        </Tooltip>;
    let checkboxInput = renderer.create(
        <TimeSpanInput
            data={data}
            text="time span data"
            onChange={() => { }}
            tooltip={tooltip}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});