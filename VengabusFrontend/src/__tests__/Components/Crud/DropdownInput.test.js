import React from 'react';
import { DropdownInput } from '../../../Components/Crud/DropdownInput';
import renderer from 'react-test-renderer';
import { Tooltip } from 'react-bootstrap';

it('renders correctly with given props', () => {
    const options = [{ label: 'Active', value: 'Active' }, { label: 'Disabled', value: 'Disabled' }];
    const tooltipText = 'Test tooltip.';
    let checkboxInput = renderer.create(
        <DropdownInput
            inputData="Active"
            text="dropdown data"
            onChange={() => { }}
            tooltipText={tooltipText}
            options={options}
        />
    );
    expect(checkboxInput.toJSON()).toMatchSnapshot();
});