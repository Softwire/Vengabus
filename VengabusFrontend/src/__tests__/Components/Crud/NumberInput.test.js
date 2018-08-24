import React from 'react';
import { NumberInput } from '../../../Components/Crud/NumberInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const tooltipText = 'Test tooltip.';
    let checkboxInput = renderer.create(
        <NumberInput
            inputData={42}
            text="numeric data"
            onChange={() => { }}
            tooltipText={tooltipText}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});