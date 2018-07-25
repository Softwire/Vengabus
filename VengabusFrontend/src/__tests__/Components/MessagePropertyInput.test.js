import 'jest-localstorage-mock';
import { shallow, mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import React from 'react';
import { MessagePropertyInput } from '../../Components/MessagePropertyInput';

configure({ adapter: new Adaptor() });

//Tests no longer work due to refactoring but may be useful as templates that will need to be implemented
//in MessageInput.test.js after the submit function is fully implemented.

//it('Correctly creates the properties of a message', () => {
//    let spy = jest.fn();
//    let wrapper = shallow(
//        <MessagePropertyInput
//            submitMessage={spy}
//        />);
//    wrapper.setState({
//        propertyNames: ["test1", "test2"],
//        propertyValues: ["any value 1", "any value 2"]
//    });
//    let submitButton = wrapper.find("#submitButton");
//    submitButton.simulate('click');
//    expect(spy).toBeCalledWith({
//        test1: "any value 1",
//        test2: "any value 2"
//    });
//});
//
//it('Correctly filters empty property names', () => {
//    let wrapper = shallow(
//        <MessagePropertyInput
//            submitMessage={(message) => {
//                expect(message[""]).toBeUndefined();
//            }}
//        />);
//    wrapper.setState({
//        propertyNames: ["test1", ""],
//        propertyValues: ["t1", "any value"]
//    });
//    let submitButton = wrapper.find("#submitButton");
//    submitButton.simulate('click');
//});
//
//it('Correctly filters duplicate property names', () => {
//    let wrapper = shallow(
//        <MessagePropertyInput
//            submitMessage={(message) => {
//                console.table(message);
//                expect(Object.keys(message).length).toEqual(2);
//            }}
//        />);
//    wrapper.setState({
//        propertyNames: ["test1", "test2", "test2"],
//        propertyValues: ["any value", "any value2", "any value 3"]
//    });
//    let submitButton = wrapper.find("#submitButton");
//    submitButton.simulate('click');
//});

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