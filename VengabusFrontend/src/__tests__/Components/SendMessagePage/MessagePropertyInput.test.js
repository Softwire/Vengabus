import 'jest-localstorage-mock';
import renderer from 'react-test-renderer';
import React from 'react';
import { MessagePropertyInput } from '../../../Components/SendMessagePage/MessagePropertyInput';

it('renders correctly', () => {
    let messagePropertyInput = renderer.create(
        <MessagePropertyInput
            properties={[]}
            handlePropertyNameChange={jest.fn()}
            handlePropertyValueChange={jest.fn()}
            deleteRow={jest.fn()}
        />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});