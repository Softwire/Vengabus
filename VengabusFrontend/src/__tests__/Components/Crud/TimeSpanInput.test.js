import React from 'react';
import { TimeSpanInput } from '../../../Components/Crud/TimeSpanInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const inputData = {
        days: 30,
        hours: 12,
        minutes: 45,
        seconds: 5,
        milliseconds: 0
    };
    const tooltipText = 'Test tooltip.';
    let checkboxInput = renderer.create(
        <TimeSpanInput
            inputData={inputData}
            text="time span data"
            onChange={() => { }}
            tooltipText={tooltipText}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});