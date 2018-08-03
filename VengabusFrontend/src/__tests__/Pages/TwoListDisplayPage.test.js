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
    console.log(queue, topic);
    testHelper.afterReactHasUpdated().then(() => {
        expect(queue.exists()).toBe(true);
        expect(topic.exists()).toBe(true);
    }
    );
});
