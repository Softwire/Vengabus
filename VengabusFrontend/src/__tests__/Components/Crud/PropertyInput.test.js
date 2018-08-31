import React from 'react';
import { CheckboxInput } from '../../../Components/Crud/CheckboxInput';
import { DropdownInput } from '../../../Components/Crud/DropdownInput';
import { NumberInput } from '../../../Components/Crud/NumberInput';
import { TimeSpanInput } from '../../../Components/Crud/TimeSpanInput';
import { PropertyInput } from '../../../Components/Crud/PropertyInput';
import { mount } from 'enzyme';

const rawConsoleError = console.error;
function suppressSpecificDataTableErrors() {
    // We use '...args' to ensure that we are passing all args on to the actual console.error()
    // Can't use 'arguments' because that doesn't exist in ES6 arrow funcs.
    console.error = (...args) => {
        const errorString = args[0];
        if (!errorString.startsWith('The above error occurred in the <PropertyInput> component')) {
            rawConsoleError(...args);
        }
    };
}
function resetConsoleError() {
    console.error = rawConsoleError;
}

beforeAll(suppressSpecificDataTableErrors);
afterAll(resetConsoleError);

it('renders with the correct component for bool data', () => {
    let wrapper = mount(
        <PropertyInput
            inputData
            text="bool data"
            onChange={() => { }}
        />
    );
    expect(wrapper.find(CheckboxInput)).toHaveLength(1);
});

it('renders with the correct component for numeric data', () => {
    let wrapper = mount(
        <PropertyInput
            inputData={42}
            text="numeric data"
            onChange={() => { }}
        />
    );
    expect(wrapper.find(NumberInput)).toHaveLength(1);
});

it('renders with the correct component for string data', () => {
    const options = [{ label: 'Active', value: 'Active' }, { label: 'Disabled', value: 'Disabled' }];
    let wrapper = mount(
        <PropertyInput
            inputData="Active"
            text="string data"
            onChange={() => { }}
            options={options}
        />
    );
    expect(wrapper.find(DropdownInput)).toHaveLength(1);
});

it('renders with the correct component for time span object data', () => {
    const inputData = {
        days: 30,
        hours: 12,
        minutes: 45,
        seconds: 5,
        milliseconds: 0
    };
    let wrapper = mount(
        <PropertyInput
            inputData={inputData}
            text="time span data"
            onChange={() => { }}
            complexInputComponentType={TimeSpanInput}
        />
    );
    expect(wrapper.find(TimeSpanInput)).toHaveLength(1);
});

it('throws descriptive error if missing options for string input', () => {
    function func() {
        mount(
            <PropertyInput
                inputData="Active"
                text="string data"
                onChange={() => { }}
            />
        );
    }
    expect(func).toThrowError('for data types of string options prop for the permitted values of the dropdown is required (in string data)');
});

it('throws descriptive error if missing componentType for object input', () => {
    const inputData = {
        days: 30,
        hours: 12,
        minutes: 45,
        seconds: 5,
        milliseconds: 0
    };
    function func() {
        mount(
            <PropertyInput
                inputData={inputData}
                text="object data"
                onChange={() => { }}
            />
        );
    }
    expect(func).toThrowError('for data types of object component type must be defined (in object data)');
});

it('throws descriptive error for unexpected data types', () => {
    const inputData = () => { };
    function func() {
        mount(
            <PropertyInput
                propertyName={"functionProp"}
                inputData={inputData}
                text="object data"
                onChange={() => { }}
            />
        );
    }
    expect(func).toThrowError("property 'functionProp' had an unsupported datatype: 'function'. Property value is: '() => {}'");
});