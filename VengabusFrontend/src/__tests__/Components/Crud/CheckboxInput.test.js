import React from 'react';
import { CheckboxInput } from '../../../Components/Crud/CheckboxInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const tooltipText = 'Test tooltip.';
    let checkboxInput = renderer.create(
        <CheckboxInput
            inputData
            text="bool data"
            onChange={() => { }}
            tooltipText={tooltipText}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});