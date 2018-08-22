import { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';
import { FormControl, Button } from "react-bootstrap";
import { MessageInput } from '../../../Components/SendMessagePage/MessageInput';
import { MessagePropertyInputRow } from '../../../Components/SendMessagePage/MessagePropertyInputRow';
import { testHelper } from '../../../TestHelpers/TestHelper';
import { wrap } from 'module';
import formatXML from 'xml-formatter';

let mockedFunction = jest.fn();
jest.mock('../../../AzureWrappers/VengaServiceBusService', () => ({
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
                resolve([{
                    name: "queue1"
                }]);
            });
        }

        listTopics = () => {
            return new Promise(function (resolve, reject) {
                resolve([{
                    name: "topic1"
                }]);
            });
        }

        sendMessageToQueue = (...args) => { mockedFunction(...args); }
        sendMessageToTopic = (...args) => { mockedFunction(...args); }
    }
}));

beforeEach(() => {
    mockedFunction.mockReset();
});

//Snapshot tests must be first because the id of new react-select elements changes each time one is mounted
it('renders correctly before data has loaded', () => {
    let messagePropertyInput = renderer.create(
        <MessageInput />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});

it('renders correctly after data has loaded', () => {
    let messagePropertyInput = renderer.create(
        <MessageInput />);

    return testHelper.afterReactHasUpdated().then(() => {
        expect(messagePropertyInput.toJSON()).toMatchSnapshot();
    });
});

//Snapshot tests must be first because the id of new react-select elements changes each time one is mounted
it('renders correctly from a predefined message', () => {
    const exampleMessage = {
        message: {
            customProperties: {
                userDefinedProp1: 'value1',
                userDefinedProp2: 'value2'
            },
            predefinedProperties: {
                MessageId: 'Message1',
                ContentType: 'null'
            },
            messageBody: 'Hello world!'
        },
        recipientIsQueue: true,
        selectedQueue: 'demoqueue1'
    };
    let messagePropertyInput = renderer.create(
        <MessageInput {...exampleMessage} />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});

//Snapshot tests must be first because the id of new react-select elements changes each time one is mounted
it('Shows a red border around invalid property names', () => {
    //Must use mount because setState cannot be called on renderer.create
    let messageInput = mount(<MessageInput />);
    messageInput.setState({
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }, { name: "test2", value: "any value 3" }]
    });
    expect.assertions(1);
    return testHelper.afterReactHasUpdated().then(() => {
        // The toJson() function available does not replace ReactComponents. Nor does debug();
        // html() does remove them, but renders a single elided string, so we need to make it readable, manually.
        expect(formatXML(messageInput.html())).toMatchSnapshot('RawHtml snapshot for "Shows a red border around invalid property names"');
    });
});

it('Correctly creates the properties of a message', async () => {
    let wrapper = mount(<MessageInput />);
    await testHelper.afterReactHasUpdated();
    wrapper.update();
    wrapper.setState({
        selectedQueue: "testQueue",
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }],
        preDefinedProperties: [{ name: "ContentType", value: "any value 3" }],
        messageBody: "body"
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    await testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();
        let confirmButton = wrapper.find("#confirm").last();
        confirmButton.simulate('click');
    });
    expect(mockedFunction).toBeCalledWith(
        "testQueue",
        {
            "messageBody": "body",
            "customProperties": { "test1": "any value 1", "test2": "any value 2" },
            "predefinedProperties": { "ContentType": "any value 3" }
        }
    );
});

it('Sends the message to the correct queue', async () => {
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        selectedQueue: "testQueue"
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    await testHelper.afterReactHasUpdated().then(() => {
        let confirmButton = wrapper.find("#confirm").last();
        confirmButton.simulate('click');
    });
    expect(mockedFunction).toBeCalledWith(
        "testQueue",
        {
            "messageBody": "",
            "customProperties": {},
            "predefinedProperties": {}
        }
    );
});

it('Correctly filters empty property names', async () => {
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        selectedQueue: "testQueue",
        userDefinedProperties: [{ name: "test1", value: "" }, { name: "test2", value: "any value 2" }]
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    await testHelper.afterReactHasUpdated().then(() => {
        let confirmButton = wrapper.find("#confirm").last();
        confirmButton.simulate('click');
    });
    expect(mockedFunction).toBeCalledWith(
        "testQueue",
        {
            "messageBody": "",
            "customProperties": { "test2": "any value 2" },
            "predefinedProperties": {}
        }
    );
});

it('Correctly filters duplicate property names', async () => {
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        selectedQueue: "testQueue",
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }, { name: "test2", value: "any value 3" }]
    });
    let submitButton = wrapper.find("#submitButton").at(0);
    submitButton.simulate('click');
    await testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();
        let confirmButton = wrapper.find("#confirm").last();
        confirmButton.simulate('click');
    });
    expect(mockedFunction).toBeCalledWith(
        "testQueue",
        {
            "messageBody": "",
            "customProperties": { "test1": "any value 1", "test2": "any value 2" },
            "predefinedProperties": {}
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

it('Discard Message button works', async () => {
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        userDefinedProperties: [{ name: "test1", value: "any value 1" }, { name: "test2", value: "any value 2" }, { name: "test3", value: "any value 3" }],
        preDefinedProperties: [{ name: 'MessageID', value: 'id' }],
        messageBody: 'Hello World!'
    });
    expect(wrapper.find(MessagePropertyInputRow).length).toEqual(4);
    let discardButton = wrapper.find(Button).last();
    discardButton.simulate('click');
    await testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();
        let confirmButton = wrapper.find("#confirm").last();
        confirmButton.simulate('click');
    });
    expect(wrapper.find(MessagePropertyInputRow).length).toEqual(0);
    let body = wrapper.find(FormControl);
    expect(body.value).toBeUndefined();
});


it('Switches from sending to a queue to sending to a topic correctly', () => {
    //Click topic radio -> Click topic dropdown -> Press down then enter to select the first topic ->
    //Click submit -> Empty message should be sent to topic1
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        selectedQueue: "testQueue" //Should not be used
    });
    //Click the topic radio button
    testHelper.clickElementWithId(wrapper, "#topic-selection-radio");
    return testHelper.afterReactHasUpdated().then(() => {
        //Click the topic dropdown
        testHelper.clickElementWithId(wrapper, "#topic-dropdown");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //Press down followed by enter to select the first topic in the list
        let topicDropdown = wrapper.find("#topic-dropdown").last();
        topicDropdown.simulate('keyDown', { key: 'ArrowDown', keyCode: 40, which: 40 });
        topicDropdown.simulate('keyDown', { key: 'Enter', keyCode: 13, which: 13 });
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //Send the message
        testHelper.clickElementWithId(wrapper, "#submitButton");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        testHelper.clickElementWithId(wrapper, "#confirm");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        expect(mockedFunction).toBeCalledWith(
            "topic1",
            {
                "messageBody": "",
                "customProperties": {},
                "predefinedProperties": {}
            }
        );
    });
});


it('Rememembers which queue was selected if the topic radio is pressed', () => {
    //Click queue dropdown -> Press down then enter to select the first queue -> Click topic radio -> Click queue radio ->
    //Click submit -> Empty message should be sent to queue1
    let wrapper = mount(<MessageInput />);
    wrapper.setState({
        selectedQueue: "testQueue" //Should not be used
    });
    //Click the queue dropdown
    testHelper.clickElementWithId(wrapper, "#queue-dropdown");
    return testHelper.afterReactHasUpdated().then(() => {
        //Press down followed by enter to select the first queue in the list
        let topicDropdown = wrapper.find("#queue-dropdown").last();
        topicDropdown.simulate('keyDown', { key: 'ArrowDown', keyCode: 40, which: 40 });
        topicDropdown.simulate('keyDown', { key: 'Enter', keyCode: 13, which: 13 });
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //Click the topic radio button
        testHelper.clickElementWithId(wrapper, "#topic-selection-radio");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //Click the queue radio button
        testHelper.clickElementWithId(wrapper, "#queue-selection-radio");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        //Send the message
        testHelper.clickElementWithId(wrapper, "#submitButton");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        testHelper.clickElementWithId(wrapper, "#confirm");
        return testHelper.afterReactHasUpdated();
    }).then(() => {
        expect(mockedFunction).toBeCalledWith(
            "queue1",
            {
                "messageBody": "",
                "customProperties": {},
                "predefinedProperties": {}
            }
        );
    });
});