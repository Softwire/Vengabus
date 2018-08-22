import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';
import { TwoListDisplay } from "../../Components/HomePage/TwoListDisplay";
import { testHelper } from '../../TestHelpers/TestHelper';
import toJson from 'enzyme-to-json';
import { EndpointTypes } from '../../Helpers/EndpointTypes';

//event object to hand to click functions
const eventObj = {};

jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {
        }

        listTopics = () => {
            return Promise.resolve(
                [
                    {
                        name: "testTopic1",
                        subscriptionCount: 12,
                        topicStatus: "Active"
                    },
                    {
                        name: "testTopic2",
                        subscriptionCount: 13,
                        topicStatus: "Active"
                    },
                    {
                        name: "testTopic3",
                        subscriptionCount: 13,
                        topicStatus: "Active"
                    }
                ]
            );
        }

        listQueues = () => {
            return Promise.resolve([
                {
                    name: "testQueue1",
                    activeMessageCount: 12,
                    deadletterMessageCount: 17
                },
                {
                    name: "testQueue2",
                    activeMessageCount: 13,
                    deadletterMessageCount: 15
                },
                {
                    name: "testQueue3",
                    activeMessageCount: 13,
                    deadletterMessageCount: 18
                }
            ]
            );
        }

        listQueueMessages = (queueName) => {
            return (queueName === "testQueue1") ? Promise.resolve(
                [
                    {
                        predefinedProperties: { messageId: "test1" },
                        uniqueId: "59298c2b-d58f-4ad0-bde9-f8a9d00a3070",
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2" },
                        uniqueId: "c9f547bf-72e1-439e-bd1f-0b590422a6f8",
                        messageBody: "banana"
                    },
                    {
                        predefinedProperties: { messageId: "test3" },
                        uniqueId: "5034e2f8-9bf0-436a-b8f4-914b43594ee1",
                        messageBody: "carrot"
                    }
                ]
            ) : Promise.reject();
        }

        listSubscriptions = (topicName) => {
            return (topicName === "testTopic1") ? Promise.resolve([
                {
                    name: "testSubscriptions1",
                    activeMessageCount: 12,
                    deadletterMessageCount: 17
                },
                {
                    name: "testSubscriptions2",
                    activeMessageCount: 13,
                    deadletterMessageCount: 15
                },
                {
                    name: "testSubscriptions3",
                    activeMessageCount: 13,
                    deadletterMessageCount: 18
                }
            ]
            ) : Promise.reject();

        }

        listSubscriptionMessages = () => {
            return Promise.resolve(
                [
                    {
                        predefinedProperties: { messageId: "test1" },
                        uniqueId: "57d7d4dd-291a-453c-a0e4-efbb664607c0",
                        messageBody: "apple"

                    },
                    {
                        predefinedProperties: { messageId: "test2" },
                        uniqueId: "873c61c3-797a-4158-941b-da8eb7410e70",
                        messageBody: "banana"
                    },
                    {
                        predefinedProperties: { messageId: "test3" },
                        uniqueId: "8ab56d4c-0204-4aa2-a888-2cc305cd0275",
                        messageBody: "carrot"
                    }
                ]);
        }
    }
}));

it('renders correctly before data is added', () => {
    let messagePropertyInput = renderer.create(
        <TwoListDisplay />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});

it('renders correctly after data is added', () => {
    let wrapper = mount(<TwoListDisplay />);
    return resetToDefaultState(wrapper).then(
        () => { expect(toJson(wrapper)).toMatchSnapshot(); }
    );
});

it('renders queues and topic titles', () => {
    let wrapper = mount(<TwoListDisplay />);

    const leftTitle = wrapper.find('#left').find('#title').text();
    const rightTitle = wrapper.find('#right').find('#title').text();
    expect(leftTitle).toBe("Queues");
    expect(rightTitle).toBe("Topics");
});

it('queues and topics populate', () => {
    let wrapper = mount(<TwoListDisplay />);

    return resetToDefaultState(wrapper).then(
        () => { return expectDefaultState(wrapper); }
    );
});

it('clicking Queues retrieves messages', () => {
    let wrapper = mount(<TwoListDisplay />);

    return resetToDefaultState(wrapper).then(
        () => { return clickAndResolveQueueRowClick(wrapper, "testQueue1"); }).then(
            () => { return expectsQueueAndMessage(wrapper); }
        );
});

it('clicking Queues to retrieved message data then returning to home screen', () => {
    let wrapper = mount(<TwoListDisplay />);

    return resetToDefaultState(wrapper).then(
        () => { return clickAndResolveQueueRowClick(wrapper, "testQueue1"); }).then(
            () => { return resetToDefaultState(wrapper); }).then(
                () => { return expectDefaultState(wrapper); }
            );
});

it('clicking Topics retrieves subscriptions', () => {
    let wrapper = mount(<TwoListDisplay />);
    return resetToDefaultState(wrapper).then(
        () => { return clickAndResolveTopicRowClick(wrapper, "testTopic1"); }).then(
            () => { return expectSubscriptionsAndTopics(wrapper); }
        );
});

it('clicking topics then Subscriptions retrieves messages', () => {
    let wrapper = mount(<TwoListDisplay />);

    return resetToDefaultState(wrapper).then(
        () => { return clickAndResolveTopicRowClick(wrapper, "testTopic1"); }).then(
            () => { return clickAndResolveSubscriptionRowClick(wrapper, "testSubscriptions1"); }).then(
                () => { return expectSubscriptionAndMessage(wrapper); }
            );
});

it('Home breadCrumb resets state', () => {
    let wrapper = mount(<TwoListDisplay />);
    return afterBreadCrumbClick(undefined, wrapper);

});

it('Can go back to Topic from Subscription using BreadCrumbs', () => {
    let wrapper = mount(<TwoListDisplay />);
    return afterBreadCrumbClick(EndpointTypes.TOPIC, wrapper);
});


//Helper functions used for repeating tests
const resetToDefaultState = (wrapper) => {
    wrapper.update();
    wrapper.instance().resetInitialStateData();
    return testHelper.afterReactHasUpdated();
};

const clickAndResolveQueueRowClick = (wrapper, queueName) => {
    wrapper.update();
    const queueList = wrapper.find('#QueueTable');
    queueList.props().clickFunction(eventObj, { name: queueName });

    return testHelper.afterReactHasUpdated();
};

const clickAndResolveTopicRowClick = (wrapper, topicName) => {
    wrapper.update();
    const topic = wrapper.find('#TopicTable');
    topic.props().clickFunction(eventObj, { name: topicName });
    return testHelper.afterReactHasUpdated();
};

const clickAndResolveSubscriptionRowClick = (wrapper, subscriptionName) => {
    wrapper.update();
    const subscriptionTable = wrapper.find('#SubscriptionTable');
    subscriptionTable.props().clickFunction(eventObj, { name: subscriptionName });

    return testHelper.afterReactHasUpdated();
};


const afterBreadCrumbClick = (breadcrumb, wrapper) => {
    switch (breadcrumb) {
        case (EndpointTypes.TOPIC):
            return clickAndResolveTopicRowClick(wrapper, "testTopic1").then(
                () => { return clickAndResolveSubscriptionRowClick(wrapper, "testSubscriptions1"); }).then(
                    () => {
                        wrapper.update();
                        const topicBreadCrumb = wrapper.find('#testTopic1').hostNodes();
                        topicBreadCrumb.simulate("click");
                        return testHelper.afterReactHasUpdated();
                    }).then(
                        () => {
                            return expectSubscriptionsAndTopics(wrapper);
                        });
        default:
            return clickAndResolveQueueRowClick(wrapper, "testQueue1").then(
                () => {
                    wrapper.update();
                    const homeBreadCrumb = wrapper.find('#Home').hostNodes();
                    homeBreadCrumb.simulate("click");
                    return testHelper.afterReactHasUpdated();
                }).then(
                    () => {
                        return expectDefaultState(wrapper);
                    });
    }
};

const expectDefaultState = (wrapper) => {
    wrapper.update();

    const queueTable = wrapper.find('#QueueTable').find("#Data");
    const topicTable = wrapper.find('#TopicTable').find("#Data");

    const leftTitle = wrapper.find('#left').find('#title').text();
    const rightTitle = wrapper.find('#right').find('#title').text();

    expect(leftTitle).toBe("Queues");
    expect(rightTitle).toBe("Topics");

    expect(queueTable).toExistOnPage();
    expect(topicTable).toExistOnPage();
};

const expectSubscriptionsAndTopics = (wrapper) => {
    wrapper.update();

    const topicTable = wrapper.find('#TopicTable').find("#Data")
    const subscriptionTable = wrapper.find('#SubscriptionTable').find("#Data");

    const leftTitle = wrapper.find('#left').find('#title').text();
    const rightTitle = wrapper.find('#right').find('#title').text();

    expect(leftTitle).toBe("Topics");
    expect(rightTitle).toBe("Subscriptions");

    expect(topicTable).toExistOnPage();
    expect(subscriptionTable).toExistOnPage();
};

const expectsQueueAndMessage = (wrapper) => {
    wrapper.update();

    const queueTable = wrapper.find('#QueueTable').find("#Data");
    const messageTable = wrapper.find('#MessageTable').find("#Data");

    const leftTitle = wrapper.find('#left').find('#title').text();
    const rightTitle = wrapper.find('#right').find('#title').text();

    expect(leftTitle).toBe("Queues");
    expect(rightTitle).toBe("Messages");

    expect(queueTable).toExistOnPage();
    expect(messageTable).toExistOnPage();
};

const expectSubscriptionAndMessage = (wrapper) => {
    wrapper.update();

    const subscriptionTable = wrapper.find('#SubscriptionTable').find("#Data");
    const messageTable = wrapper.find('#MessageTable').find("#Data");

    const leftTitle = wrapper.find('#left').find('#title').text();
    const rightTitle = wrapper.find('#right').find('#title').text();

    expect(leftTitle).toBe("Subscriptions");
    expect(rightTitle).toBe("Messages");

    expect(subscriptionTable).toExistOnPage();
    expect(messageTable).toExistOnPage();
};

