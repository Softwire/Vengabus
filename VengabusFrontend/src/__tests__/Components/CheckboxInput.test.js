import React from 'react';
import { CheckboxInput } from '../../Components/CheckboxInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const tooltip =
        <Tooltip id="tooltip">
            Test tooltip.
        </Tooltip>;
    let checkboxInput = renderer.create(
        <CheckboxInput
            data
            text="bool data"
            onChange={() => { }}
            tooltip={tooltip}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});