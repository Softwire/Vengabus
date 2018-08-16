import { PurgeMessagesButton } from '../../Components/PurgeMessagesButton';
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';
import { Modal } from 'react-bootstrap';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { testHelper } from '../../TestHelpers/TestHelper';

let mockPurgeSubscrionMessage = jest.fn();
let mockPurgeQueueMessages = jest.fn();
let mockPurgeTopicMessages = jest.fn();
jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {
        }

        getQueueDetails = () => Promise.resolve({
            data: { //qqMDM data!?
                activeMessageCount: 10
            }
        });

        getSubscriptionDetails = () => Promise.resolve({
            data: { //qqMDM data!?
                activeMessageCount: 10
            }
        });

        listSubscriptions = () => Promise.resolve({
            data: [{ //qqMDM data!?
                name: "subscription1",
                activeMessageCount: 10
            }]
        });

        purgeQueueMessages = (queueName) => { mockPurgeQueueMessages(queueName); }
        purgeTopicMessages = (topicName) => { mockPurgeTopicMessages(topicName); }
        purgeSubscriptionMessages = (topicName, subscriptionName) => { mockPurgeSubscrionMessage(subscriptionName); }
    }
}));

function afterModalPurgeButtonIsClicked(wrapper, mockFunction, endpointName) {
    testHelper.clickElementWithId(wrapper, "#alertPurge");


    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();
        testHelper.clickElementWithId(wrapper, "#confirm");

        return testHelper.afterReactHasUpdated();

    }).then(() => {
        expect(mockFunction).toHaveBeenCalled();
        expect(mockFunction).toHaveBeenCalledWith(endpointName);
    });
}

describe('PurgeMessagesButton', () => {
    let subscriptionName = "subscriptionName";
    let topicName = "topicName";
    let queueName = "queueName";

    it('renders correctly with given props', () => {
        let deleteMessagesButton = renderer.create(
            <PurgeMessagesButton type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />);
        expect(deleteMessagesButton.toJSON()).toMatchSnapshot();
    });

    it('Modal popup has Purge and Cancel buttons', () => {
        let wrapper = mount(<PurgeMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />);
        expect(wrapper.find("#cancel").hostNodes()).toHaveLength(0);
        expect(wrapper.find("#confirm").hostNodes()).toHaveLength(0);
        testHelper.clickElementWithId(wrapper, "#alertPurge");

        return testHelper.afterReactHasUpdated().then(() => {
            wrapper.update();
            expect(wrapper.find("#cancel").hostNodes()).toHaveLength(1);
            expect(wrapper.find("#confirm").hostNodes()).toHaveLength(1);
        });
    });

    it('clicking cancel button does not send purge request to endpoint and closes the Modal', () => {
        let wrapper = mount(<PurgeMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />);
        testHelper.clickElementWithId(wrapper, "#alertPurge");

        return testHelper.afterReactHasUpdated().then(() => {
            wrapper.update();
            testHelper.clickElementWithId(wrapper, "#cancel");

            return testHelper.afterReactHasUpdated();
        }).then(() => {
            expect(mockPurgeQueueMessages).not.toHaveBeenCalled();
            expect(wrapper.find(Modal).at(0).prop("show")).toBeFalsy();
        });
    });

    it('call VengaBusService purge subscription messages method once', () => {
        let wrapper = mount(<PurgeMessagesButton type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />);
        return afterModalPurgeButtonIsClicked(wrapper, mockPurgeSubscrionMessage, subscriptionName);
    });

    it('call VengaBusService purge queue messages method once', () => {
        let wrapper = mount(<PurgeMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />);
        return afterModalPurgeButtonIsClicked(wrapper, mockPurgeQueueMessages, queueName);
    });

    it('call VengaBusService purge topic messages method once', () => {
        let wrapper = mount(<PurgeMessagesButton type={EndpointTypes.TOPIC} endpointName={topicName} />);
        return afterModalPurgeButtonIsClicked(wrapper, mockPurgeTopicMessages, topicName);
    });
});
