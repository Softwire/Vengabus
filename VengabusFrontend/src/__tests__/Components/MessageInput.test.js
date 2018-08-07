import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';
import { FormControl, Button } from "react-bootstrap";
import { MessageInput } from '../../Components/MessageInput';
import { MessagePropertyInputRow } from '../../Components/MessagePropertyInputRow';

//QQ Implement a test that checks that the submit function works correctly

jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {

        }

        getWriteableMessageProperties = () => {
            return new Promise(function (resolve, reject) {
                resolve(['MessageId', 'ContentType']);
            });
        }

        getReadableMessageProperties = () => {
            return new Promise(function (resolve, reject) {
                resolve(['MessageId', 'ContentType']);
            });
        }
    }
}));

it('Deletes a property when the delete button is pressed', () => {
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }, { name: "test3", value: "any value 3" }]
    });
    let deleteButton = wrapper.find(MessagePropertyInputRow).at(0).find(Button);
    deleteButton.simulate('click');
    expect(wrapper.find(MessagePropertyInputRow).length).toEqual(2);
});

it('Discard Message button works', () => {
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }, { name: "test3", value: "any value 3" }],
        preDefinedProperties: [{ name: 'MessageID', value: 'id' }],
        messageBody: 'Hello World!'
    });
    let discardButton = wrapper.find(Button).last();
    discardButton.simulate('click');
    expect(wrapper.find(MessagePropertyInputRow).length).toEqual(0);
    let body = wrapper.find(FormControl);
    expect(body.value).toBeUndefined();
});

it('renders correctly', () => {
    let messagePropertyInput = renderer.create(
        <MessageInput />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});

it('renders correctly from a predefined message', () => {
    const message = {
        customProperties: {
            userDefinedProp1: 'value1',
            userDefinedProp2: 'value2'
        },
        predefinedProperties: {
            MessageId: 'Message1',
            ContentType: 'null'
        },
        MessageBody: 'Hello world!'
    };
    let messagePropertyInput = renderer.create(
        <MessageInput message={message} />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});