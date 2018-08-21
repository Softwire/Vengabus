import React from 'react';
import { DropdownInput } from '../../../Components/Crud/DropdownInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const options = [{ label: 'Active', value: 'Active' }, { label: 'Disabled', value: 'Disabled' }];
    const tooltip =
        <Tooltip id="tooltip">
            Test tooltip.
        </Tooltip>;
    let checkboxInput = renderer.create(
        <DropdownInput
            data="Active"
            text="dropdown data"
            onChange={() => { }}
            tooltip={tooltip}
            options={options}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});