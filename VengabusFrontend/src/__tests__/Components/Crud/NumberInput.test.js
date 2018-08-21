import React from 'react';
import { NumberInput } from '../../../Components/Crud/NumberInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const tooltip =
        <Tooltip id="tooltip">
            Test tooltip.
        </Tooltip>;
    let checkboxInput = renderer.create(
        <NumberInput
            data={42}
            text="numeric data"
            onChange={() => { }}
            tooltip={tooltip}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});