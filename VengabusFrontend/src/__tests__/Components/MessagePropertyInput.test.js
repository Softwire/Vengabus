import 'jest-localstorage-mock';
import { shallow, mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import React from 'react';
import { Button } from "react-bootstrap";
import { MessagePropertyInput } from '../../Components/MessagePropertyInput';
import { MessagePropertyInputRow } from '../../Components/MessagePropertyInputRow';

configure({ adapter: new Adaptor() });

it('Correctly creates the properties of a message', () => {
    let spy = jest.fn();
    let wrapper = shallow(
        <MessagePropertyInput
            submitMessage={spy}
        />);
    wrapper.setState({
        propertyNames: ["test1", "test2"],
        propertyValues: ["any value 1", "any value 2"]
    });
    let submitButton = wrapper.find("#submitButton");
    submitButton.simulate('click');
    expect(spy).toBeCalledWith({
        test1: "any value 1",
        test2: "any value 2"
    });
});

it('Correctly filters reserved property names', () => {
    let wrapper = shallow(
        <MessagePropertyInput
            submitMessage={(message) => {
                expect(message.body).toBeUndefined();
            }}
        />);
    wrapper.setState({
        propertyNames: ["test1", "body"],
        propertyValues: ["t1", "any value"]
    });
    let submitButton = wrapper.find("#submitButton");
    submitButton.simulate('click');
});

it('Correctly filters empty property names', () => {
    let wrapper = shallow(
        <MessagePropertyInput
            submitMessage={(message) => {
                expect(message[""]).toBeUndefined();
            }}
        />);
    wrapper.setState({
        propertyNames: ["test1", ""],
        propertyValues: ["t1", "any value"]
    });
    let submitButton = wrapper.find("#submitButton");
    submitButton.simulate('click');
});

it('Correctly filters duplicate property names', () => {
    let wrapper = shallow(
        <MessagePropertyInput
            submitMessage={(message) => {
                expect(Object.keys(message).length).toEqual(2);
            }}
        />);
    wrapper.setState({
        propertyNames: ["test1", "test2", "test2"],
        propertyValues: ["any value", "any value2", "any value 3"]
    });
    let submitButton = wrapper.find("#submitButton");
    submitButton.simulate('click');
});

it('Deletes a property when the delete button is pressed', () => {
    let wrapper = mount(<MessagePropertyInput />);
    wrapper.setState({
        propertyNames: ["test1", "test2"],
        propertyValues: ["any value", "any value2"]
    });
    console.log(wrapper.find(MessagePropertyInputRow).at(0));
    let deleteButton = wrapper.find(MessagePropertyInputRow).at(0).find(Button);
    deleteButton.simulate('click');
    expect(wrapper.find(MessagePropertyInputRow).length).toEqual(1);
});

it('renders correctly', () => {
    let messagePropertyInput = renderer.create(
        <MessagePropertyInput
            submitMessage={jest.fn()}
        />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});