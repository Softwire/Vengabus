import { DeleteMessagesButton } from '../../Components/DeleteMessagesButton';
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';
import { Modal } from 'react-bootstrap';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { testHelper } from '../../TestHelpers/TestHelper';

let mockDeleteSubscrionMessage = jest.fn();
let mockDeleteQueueMessages = jest.fn();
let mockDeleteTopicMessages = jest.fn();
jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {
        }

        getQueueDetails = () => Promise.resolve({
            data: {
                activeMessageCount: 10
            }
        });

        getSubscriptionDetails = () => Promise.resolve({
            data: {
                activeMessageCount: 10
            }
        });

        listSubscriptions = () => Promise.resolve({
            data: [{
                name: "subscription1",
                activeMessageCount: 10
            }]
        });

        deleteQueueMessages = (queueName) => { mockDeleteQueueMessages(queueName); }
        deleteTopicMessages = (topicName) => { mockDeleteTopicMessages(topicName); }
        deleteSubscriptionMessages = (topicName, subscriptionName) => { mockDeleteSubscrionMessage(subscriptionName); }
    }
}));

function afterModalDeleteButtonIsClicked(wrapper, mockFunction, endpointName) {
    testHelper.clickElementWithId(wrapper, "#alertDelete");


    return testHelper.afterReactHasUpdated().then(() => {
        wrapper.update();
        testHelper.clickElementWithId(wrapper, "#confirm");

        return testHelper.afterReactHasUpdated();

    }).then(() => {
        expect(mockFunction).toHaveBeenCalled();
        expect(mockFunction).toHaveBeenCalledWith(endpointName);
    });
}

describe('DeleteMessagesButton', () => {
    let subscriptionName = "subscriptionName";
    let topicName = "topicName";
    let queueName = "queueName";

    it('renders correctly with given props', () => {
        let deleteMessagesButton = renderer.create(
            <DeleteMessagesButton type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />);
        expect(deleteMessagesButton.toJSON()).toMatchSnapshot();
    });

    it('Modal popup has Delete and Cancel buttons', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />);
        expect(wrapper.find("#cancel").hostNodes()).toHaveLength(0);
        expect(wrapper.find("#confirm").hostNodes()).toHaveLength(0);
        testHelper.clickElementWithId(wrapper, "#alertDelete");

        return testHelper.afterReactHasUpdated().then(() => {
            wrapper.update();
            expect(wrapper.find("#cancel").hostNodes()).toHaveLength(1);
            expect(wrapper.find("#confirm").hostNodes()).toHaveLength(1);
        });
    });

    it('clicking cancel button does not send delete request to endpoint and closes the Modal', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />);
        testHelper.clickElementWithId(wrapper, "#alertDelete");

        return testHelper.afterReactHasUpdated().then(() => {
            wrapper.update();
            testHelper.clickElementWithId(wrapper, "#cancel");

            return testHelper.afterReactHasUpdated();
        }).then(() => {
            expect(mockDeleteQueueMessages).not.toHaveBeenCalled();
            expect(wrapper.find(Modal).at(0).prop("show")).toBeFalsy();
        });
    });

    it('call VengaBusService delete subscription messages method once', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />);
        return afterModalDeleteButtonIsClicked(wrapper, mockDeleteSubscrionMessage, subscriptionName);
    });

    it('call VengaBusService delete queue messages method once', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />);
        return afterModalDeleteButtonIsClicked(wrapper, mockDeleteQueueMessages, queueName);
    });

    it('call VengaBusService delete topic messages method once', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.TOPIC} endpointName={topicName} />);
        return afterModalDeleteButtonIsClicked(wrapper, mockDeleteTopicMessages, topicName);
    });
});
