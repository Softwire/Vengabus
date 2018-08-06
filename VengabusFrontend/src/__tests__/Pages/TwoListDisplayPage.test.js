import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';
import { TwoListDisplayPage } from "../../Pages/TwoListDisplayPage"
import { testHelper } from '../../TestHelpers/TestHelper'


jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {

        }
        listTopics = () => {
            return new Promise(
                function (resolve, reject) {
                    resolve = [
                        {
                            name: "test1",
                            subscriptionCount: 12,
                            topicStatus: "Active"
                        },
                        {
                            name: "test2",
                            subscriptionCount: 13,
                            topicStatus: "Active"
                        },
                        {
                            name: "test3",
                            subscriptionCount: 13,
                            topicStatus: "Active"
                        }
                    ];
                });
        }


        listQueues = () => {
            return new Promise(
                function (resolve, reject) {
                    resolve = [
                        {
                            name: "test1",
                            activeMessageCount: 12,
                            deadletterMessageCount: 17
                        },
                        {
                            name: "test2",
                            activeMessageCount: 13,
                            deadletterMessageCount: 15
                        },
                        {
                            name: "test3",
                            activeMessageCount: 13,
                            deadletterMessageCount: 18
                        }
                    ];
                });
        }

        listQueueMessages = () => {
            return new Promise(
                function (resolve, reject) {
                    resolve = [
                        {
                            messageId: "test1",
                            messageBody: "apple"

                        },
                        {
                            messageId: "test2",
                            messageBody: "banna"
                        },
                        {
                            messageId: "test3",
                            messageBody: "carrot"
                        }
                    ];
                });

        }
        listSubscriptions = () => {
            return new Promise(
                function (resolve, reject) {
                    resolve = [
                        {
                            name: "test1",
                            activeMessageCount: 12,
                            deadletterMessageCount: 17
                        },
                        {
                            name: "test2",
                            activeMessageCount: 13,
                            deadletterMessageCount: 15
                        },
                        {
                            name: "test3",
                            activeMessageCount: 13,
                            deadletterMessageCount: 18
                        }
                    ];
                });

        }
    }
}));

//Test when page loads it looks correct pre data update
it('renders correctly before data is added', () => {
    let messagePropertyInput = renderer.create(
        <TwoListDisplayPage />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});

//Test when page loads it looks correct pre data update
it('renders queues and topic titles', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    const leftTitle = wrapper.find('#leftTitle').text();
    const rightTitle = wrapper.find('#rightTitle').text();
    expect(leftTitle).toBe("Queues");
    expect(rightTitle).toBe("Topics");
});

//press update results change
it('queues and topics populate when clicked', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    const button = wrapper.find('#Update').at(0);
    button.simulate("click");
    const queue = wrapper.find('#QueueTable').find("#Data");
    const topic = wrapper.find('#TopicTable').find("#Data");
    testHelper.afterReactHasUpdated().then(() => {
        expect(queue.exists()).toBe(true);
        expect(topic.exists()).toBe(true);
    }
    );
});

//clicks a queue item and checks second box is a message box with messages
it('clicking Queue work', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    const button = wrapper.find('#Update').at(0);
    button.simulate("click");
    const queue = wrapper.find('#QueueTable');

    queue.props().clickFunction('e', { name: "test1" });
    testHelper.afterReactHasUpdated().then(() => {
        const message = wrapper.find('#MessageTable');
        const rightTitle = wrapper.find('#rightTitle').text();
        expect(message.exists()).toBe(true);
        expect(rightTitle).toBe("Messages");
    });
});


//clicks a topic item and checks second box is a subsction box with subsciptions
it('clicking subs work', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    const button = wrapper.find('#Update').at(0);
    button.simulate("click");
    const topic = wrapper.find('#TopicTable');

    topic.props().clickFunction('e', { name: "test1" });
    testHelper.afterReactHasUpdated().then(() => {
        const message = wrapper.find('#SubscriptionTable');
        const rightTitle = wrapper.find('#rightTitle').text();
        expect(message.exists()).toBe(true);
        expect(rightTitle).toBe("Subscriptions");
    });
});