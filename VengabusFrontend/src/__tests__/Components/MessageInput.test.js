import { mount, shallow, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import React from 'react';
import { FormControl, Button } from "react-bootstrap";
import { MessageInput } from '../../Components/MessageInput';
import { MessagePropertyInputRow } from '../../Components/MessagePropertyInputRow';

let mockedFunction = jest.fn();
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

        listQueues = () => {
            return new Promise(function (resolve, reject) {
                resolve({
                    data: {
                        name: "queue1"
                    }
                });
            });
        }

        listTopics = () => {
            return new Promise(function (resolve, reject) {
                resolve({
                    data: {
                        name: "topic1"
                    }
                });
            });
        }

        sendMessageToQueue = (...args) => { mockedFunction(...args); }
    }
}));

//Snapshot tests must be first because the id of new react-select elements changes each time one is mounted
it('renders correctly', () => {
    let messagePropertyInput = renderer.create(
        <MessageInput />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});

//Snapshot tests must be first because the id of new react-select elements changes each time one is mounted
it('renders correctly from a predefined message', () => {
    const data = {
        message: {
            customProperties: {
                userDefinedProp1: 'value1',
                userDefinedProp2: 'value2'
            },
            predefinedProperties: {
                MessageId: 'Message1',
                ContentType: 'null'
            },
            MessageBody: 'Hello world!'
        }
    };
    let messagePropertyInput = renderer.create(
        <MessageInput data={data} />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});

it('Correctly creates the properties of a message', () => {
    let wrapper = shallow(<MessageInput />);
    wrapper.setState({
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }],
        preDefinedProperties: [{ name: "ContentType", value: "any value 3" }],
        messageBody: "body"
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    expect(mockedFunction).toBeCalledWith(
        undefined, //Selected queue not being tested in this test
        {
            "MessageBody": "body",
            "ContentType": "any value 3",
            "MessageProperties": { "test1": "any value 1", "test2": "any value 2" }
        }
    );
});

it('Sends the message to the correct queue', () => {
    let wrapper = shallow(<MessageInput />);
    wrapper.setState({
        selectedQueue: "testQueue"
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    expect(mockedFunction).toBeCalledWith(
        "testQueue",
        {
            "MessageBody": "",
            "MessageProperties": {}
        }
    );
});

it('Correctly filters empty property names', () => {
    let wrapper = shallow(<MessageInput />);
    wrapper.setState({
        userDefinedProperties: [{ name: "test1", value: "" }, { name: "test2", value: "any value 2" }]
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    expect(mockedFunction).toBeCalledWith(
        undefined, //Selected queue not being tested in this test
        {
            "MessageBody": "",
            "MessageProperties": { "test2": "any value 2" }
        }
    );
});

it('Correctly filters duplicate property names', () => {
    let wrapper = shallow(<MessageInput />);
    wrapper.setState({
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }, { name: "test2", value: "any value 3" }]
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    expect(mockedFunction).toBeCalledWith(
        undefined, //Selected queue not being tested in this test
        {
            "MessageBody": "",
            "MessageProperties": { "test1": "any value 1", "test2": "any value 2" }
        }
    );
});

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
    let wrapper = shallow(<MessageInput />);
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