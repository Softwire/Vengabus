import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { CrudInterface } from '../../../Components/Crud/CrudInterface';
import { EndpointTypes } from '../../../Helpers/EndpointTypes';
import { testHelper } from '../../../TestHelpers/TestHelper';

jest.mock('../../../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: class {
        constructor() {
        }

        getQueueDetails = () => {
            return new Promise(function (resolve, reject) {
                resolve({
                    activeMessageCount: 4,
                    deadletterMessageCount: 0,
                    autoDeleteOnIdle: "110.02:48:05.4780000",
                    enableDeadLetteringOnMessageExpiration: false,
                    enablePartitioning: true,
                    maxDeliveryCount: 10,
                    maxSizeInMegabytes: 16384,
                    mostRecentDeadLetter: null,
                    name: 'test',
                    requiresDuplicateDetection: false,
                    requiresSession: false,
                    supportOrdering: false,
                    status: 'Active'
                });
            });
        }

        getTopicDetails = () => {
            return new Promise(function (resolve, reject) {
                resolve({
                    autoDeleteOnIdle: "110.02:48:05.4780000",
                    enablePartitioning: true,
                    maxSizeInMegabytes: 16384,
                    name: 'test',
                    requiresDuplicateDetection: false,
                    supportOrdering: false,
                    topicStatus: 'Active',
                    subscriptionCount: 3
                });
            });
        }

        getSubscriptionDetails = () => {
            return new Promise(function (resolve, reject) {
                resolve({
                    activeMessageCount: 4,
                    deadletterMessageCount: 5,
                    autoDeleteOnIdle: "110.02:48:05.4780000",
                    enableDeadLetteringOnMessageExpiration: false,
                    enablePartitioning: true,
                    maxDeliveryCount: 10,
                    mostRecentDeadLetter: "2018-07-27T11:03:57.6569871Z",
                    name: 'test',
                    requiresSession: false,
                    subscriptionStatus: 'Active'
                });
            });
        }
    }
}));

const rawConsoleError = console.error;
function suppressSpecificDataTableErrors() {
    // We use '...args' to ensure that we are passing all args on to the actual console.error()
    // Can't use 'arguments' because that doesn't exist in ES6 arrow funcs.
    console.error = (...args) => {
        const errorString = args[0];
        if (!errorString.startsWith('The above error occurred in the <CrudInterface> component')) {
            rawConsoleError(...args);
        }
    };
}
function resetConsoleError() {
    console.error = rawConsoleError;
}

beforeAll(suppressSpecificDataTableErrors);
afterAll(resetConsoleError);

it('renders correctly for queue with given props', () => {
    let crudInterface = renderer.create(
        <CrudInterface
            endpointType={EndpointTypes.QUEUE}
            selectedEndpoint="test"
        />
    );
    return testHelper.afterReactHasUpdated().then(() => {
        expect(crudInterface.toJSON()).toMatchSnapshot();
    });
});

it('renders correctly for topic with given props', () => {
    let crudInterface = renderer.create(
        <CrudInterface
            endpointType={EndpointTypes.TOPIC}
            selectedEndpoint="test"
        />
    );
    return testHelper.afterReactHasUpdated().then(() => {
        expect(crudInterface.toJSON()).toMatchSnapshot();
    });
});

it('renders correctly for subscription with given props', () => {
    let crudInterface = renderer.create(
        <CrudInterface
            endpointType={EndpointTypes.SUBSCRIPTION}
            selectedEndpoint="test"
            parentTopic="test"
        />
    );
    return testHelper.afterReactHasUpdated().then(() => {
        expect(crudInterface.toJSON()).toMatchSnapshot();
    });
});

it('throws a descriptive error if selectedEndpoint prop is missing', () => {
    function func() {
        mount(
            <CrudInterface />
        );
    }
    expect(func).toThrowError('page requires selectedEndpoint prop');
});

it('throws a descriptive error if parentTopic is undefined for a subscription', () => {
    function func() {
        mount(
            <CrudInterface
                endpointType={EndpointTypes.SUBSCRIPTION}
                selectedEndpoint="test"
            />
        );
    }
    expect(func).toThrowError('for subscriptions parent topic must be defined');
});

it('throws a descriptive error if endpoint type is invalid', () => {
    function func() {
        mount(
            <CrudInterface
                endpointType="invalid"
                selectedEndpoint="test"
            />
        );
    }
    expect(func).toThrowError('unexpected endpoint type: invalid');
});

