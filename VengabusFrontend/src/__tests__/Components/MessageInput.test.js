import 'jest-localstorage-mock';
import { mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import React from 'react';
import { Button } from "react-bootstrap";
import { MessageInput } from '../../Components/MessageInput';
import { MessagePropertyInputRow } from '../../Components/MessagePropertyInputRow';

configure({ adapter: new Adaptor() });

//QQ Implement a test that checks that the submit function works correctly once it
//acually does something instead of just console.table


it('Deletes a property when the delete button is pressed', () => {
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        propertyNames: ["test1", "test2", "test3"],
        propertyValues: ["any value", "any value2", "any value3"]
    });
    let deleteButton = wrapper.find(MessagePropertyInputRow).at(0).find(Button);
    deleteButton.simulate('click');
    expect(wrapper.find(MessagePropertyInputRow).length).toEqual(2);
});

it('renders correctly', () => {
    let messagePropertyInput = renderer.create(
        <MessageInput />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});