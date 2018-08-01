import { DeleteMessagesButton } from '../../Components/DeleteMessagesButton';
import renderer from 'react-test-renderer';
import React from 'react';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
import { EndpointTypes } from '../../Helpers/EndpointTypes';
import { Button } from "react-bootstrap";
import { testHelper } from '../../Helpers/testHelper';

let mockDeleteSubscrionMessage = jest.fn();
let mockDeleteQueueMessages = jest.fn();
let mockDeleteTopicMessages = jest.fn();

configure({ adapter: new Adaptor() });
jest.mock('../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {
        }

        getQueueDetails = () => new Promise(function (resolve, reject) {
            resolve({
                data: {
                    activeMessageCount: 10
                }
            });
        });

        getSubscriptionDetails = () => new Promise(function (resolve, reject) {
            resolve({
                data: {
                    activeMessageCount: 10
                }
            });
        });

        listSubscriptions = () => new Promise(function (resolve, reject) {
            resolve({
                data: [{
                    name: "subscription1",
                    activeMessageCount: 10
                }]
            });
        });

        deleteQueueMessages = () => { mockDeleteQueueMessages(); }
        deleteTopicMessages = () => { mockDeleteTopicMessages(); }
        deleteSubscriptionMessages = () => { mockDeleteSubscrionMessage(); }
    }
}));

describe('DeleteMessagesButton', () => {
    let subscriptionName = "subscriptionName";
    let topicName = "topicName";
    let queueName = "queueName";

    it('renders correctly with given props', () => {
        let deleteMessagesButton = renderer.create(
            <DeleteMessagesButton type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />);
        expect(deleteMessagesButton.toJSON()).toMatchSnapshot();
    });

    it('call VengaBusService delete subscription messages method once', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.SUBSCRIPTION} endpointName={subscriptionName} parentName={topicName} />);
        return testHelper.testVengaBusFunctionCalling(wrapper, mockDeleteSubscrionMessage);
    });

    it('call VengaBusService delete queue messages method once', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.QUEUE} endpointName={queueName} />);
        return testHelper.testVengaBusFunctionCalling(wrapper, mockDeleteQueueMessages);
    });

    it('call VengaBusService delete topic messages method once', () => {
        let wrapper = mount(<DeleteMessagesButton type={EndpointTypes.TOPIC} endpointName={topicName} />);
        return testHelper.testVengaBusFunctionCalling(wrapper, mockDeleteTopicMessages);
    });
});
