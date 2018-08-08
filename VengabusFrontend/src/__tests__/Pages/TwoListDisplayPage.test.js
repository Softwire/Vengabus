import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';
import { TwoListDisplayPage } from "../../Pages/TwoListDisplayPage";
import { testHelper } from '../../TestHelpers/TestHelper';

//QQ DATA IS HERE 

jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {

        }
        listTopics = () => {
            return Promise.resolve({
                data: [
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
                ]
            });
        }


        listQueues = () => {
            return Promise.resolve({
                data: [
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
                ]
            });

        }

        listQueueMessages = () => {
            return Promise.resolve({
                data: [
                    {
                        predefinedProperties: { messageId: "test1" },
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2" },
                        messageBody: "banna"
                    },
                    {
                        predefinedProperties: { messageId: "test3" },
                        messageBody: "carrot"
                    }
                ]
            });

        }
        listSubscriptions = () => {
            return Promise.resolve({
                data: [
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
                ]
            });

        }

        listSubscriptionMessages = () => {
            return Promise.resolve({
                data: [
                    {
                        predefinedProperties: { messageId: "test1" },
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2" },
                        messageBody: "banna"
                    },
                    {
                        predefinedProperties: { messageId: "test3" },
                        messageBody: "carrot"
                    }
                ]
            });
        }
    }
}));


it('renders correctly before data is added', () => {
    let messagePropertyInput = renderer.create(
        <TwoListDisplayPage />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});


it('renders queues and topic titles', () => {
    let wrapper = mount(<TwoListDisplayPage />);

    const leftTitle = wrapper.find('#leftTitle').text();
    const rightTitle = wrapper.find('#rightTitle').text();
    expect(leftTitle).toBe("Queues");
    expect(rightTitle).toBe("Topics");
});


it('queues and topics populate', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    wrapper.instance().resetInitialStateData();

    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();

        const queueList = wrapper.find('#QueueTable').find("#Data");
        const topicList = wrapper.find('#TopicTable').find("#Data");
        expect(queueList.exists()).toBe(true);
        expect(topicList.exists()).toBe(true);
    }
    );

});


it('clicking Queues retrieves messages', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    wrapper.instance().resetInitialStateData();

    const queueList = wrapper.find('#QueueTable');
    queueList.props().clickFunction('e', { name: "test1" });

    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();
        const messageList = wrapper.find('#MessageTable');
        const rightTitle = wrapper.find('#rightTitle').text();
        expect(rightTitle).toBe("Messages");
        expect(messageList.exists()).toBe(true);

    });
});

it('clicking Topics retrieves subscriptions', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    wrapper.instance().resetInitialStateData();

    const topic = wrapper.find('#TopicTable');
    topic.props().clickFunction('e', { name: "test1" });

    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();

        const subscriptionTable = wrapper.find('#SubscriptionTable');
        const rightTitle = wrapper.find('#rightTitle').text();

        expect(rightTitle).toBe("Subscriptions");
        expect(subscriptionTable.exists()).toBe(true);

    });
});


it('clicking Subscriptions retrieves messages', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    wrapper.instance().resetInitialStateData();

    const topicTable = wrapper.find('#TopicTable');
    topicTable.props().clickFunction('e', { name: "test1" });

    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();

        const subscriptionTable = wrapper.find('#SubscriptionTable');
        subscriptionTable.props().clickFunction('e', { name: "test1" });

        return testHelper.afterReactHasUpdated().then(() => {
            wrapper.update();

            const messageTable = wrapper.find('#MessageTable');
            const rightTitle = wrapper.find('#rightTitle').text();

            expect(rightTitle).toBe("Messages");
            expect(messageTable.exists()).toBe(true);

        });
    });
});


it('Home breadCrumb resets state', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    wrapper.instance().resetInitialStateData();

    const queueTable = wrapper.find('#QueueTable');
    queueTable.props().clickFunction('e', { name: "test1" });

    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();

        const homeBreadCrumb = wrapper.find('#Home').hostNodes();
        homeBreadCrumb.simulate("click");

        return testHelper.afterReactHasUpdated().then(() => {
            wrapper.update();

            const queueTable = wrapper.find('#QueueTable').find("#Data");
            const topicTable = wrapper.find('#TopicTable').find("#Data");

            const rightTitle = wrapper.find('#rightTitle').text();
            expect(rightTitle).toBe("Topics");

            const leftTitle = wrapper.find('#leftTitle').text();
            expect(leftTitle).toBe("Queues");

            expect(queueTable.exists()).toBe(true);
            expect(topicTable.exists()).toBe(true);
        });
    });
});


it('Can go back to Topic from Subscription using BreadCrumbs', () => {
    let wrapper = mount(<TwoListDisplayPage />);
    wrapper.instance().resetInitialStateData();

    const topicTable = wrapper.find('#TopicTable');
    topicTable.props().clickFunction('e', { name: "test1" });

    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();

        const subscriptionTable = wrapper.find('#SubscriptionTable');
        subscriptionTable.props().clickFunction('e', { name: "test2" });

        return testHelper.afterReactHasUpdated().then(() => {
            wrapper.update();

            const topicBreadCrumb = wrapper.find('#test1').hostNodes();
            topicBreadCrumb.simulate("click");

            return testHelper.afterReactHasUpdated().then(() => {
                wrapper.update();

                const subscriptionTable = wrapper.find('#SubscriptionTable');
                const topicTable = wrapper.find('#TopicTable');

                const rightTitle = wrapper.find('#rightTitle').text();
                const leftTitle = wrapper.find('#leftTitle').text();

                expect(rightTitle).toBe("Subscriptions");
                expect(leftTitle).toBe("Topics");

                expect(subscriptionTable.exists()).toBe(true);
                expect(topicTable.exists()).toBe(true);
            });
        });
    });
});