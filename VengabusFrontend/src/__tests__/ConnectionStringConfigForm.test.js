import 'jest-localstorage-mock';
import { mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import { testHelper } from '../Helpers/testHelper';
import { ServiceBusInfoBox } from "../Components/ServiceBusInfoBox";
import { VengaServiceBusService } from "../AzureWrappers/VengaServiceBusService";

import React from 'react';
import {
    ConnectionStringConfigForm,
    LOCAL_STORAGE_STRINGS
} from "../Components/ConnectionStringConfigForm";
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

configure({ adapter: new Adaptor() });

jest.mock('../AzureWrappers/VengaServiceBusService', () => ({
    VengaServiceBusService: {
        getServiceBusProperties: () => new Promise(function (resolve, reject) {
            resolve({
                name: 'name ex',
                status: 'true',
                location: 'uk?',
                permission: 'all'
            });
        })
    }
}));

it('component renders fine when connection string localStorage is not present', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, undefined);
    const wrapper = mount(<ConnectionStringConfigForm />);
});

it('component renders fine when connection string localStorage *is* present', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'some Value');
    const wrapper = mount(<ConnectionStringConfigForm />);
});

it('localStore is updated when the connection string form is changed', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'before');
    const wrapper = mount(<ConnectionStringConfigForm />);

    //Cannot use the id of the form to find it because the wrapper then contains two elements instead of one
    //Not sure why this happens
    const connectionStringInput = wrapper.find('input[placeholder="Enter Connection String"]');
    connectionStringInput.simulate('change', { target: { value: 'after' } });

    return testHelper.afterReactHasUpdated().then(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.ConnectionString)).toEqual('after');
    });
});

it('localStore is updated when the API location form is changed', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'before');
    const wrapper = mount(<ConnectionStringConfigForm />);

    //Cannot use the id of the form to find it because the wrapper then contains two elements instead of one
    //Not sure why this happens
    const connectionStringInput = wrapper.find('#APILocationForm');
    connectionStringInput.simulate('change', { target: { value: 'after' } });

    return testHelper.afterReactHasUpdated().then(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.APIroot)).toEqual('after');
    });
});

it('ServiceBusConnection is updated appropriately on page load', () => {
    serviceBusConnection.setConnectionString('beforeConnectionString');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'afterConnectionString');
    serviceBusConnection.setApiRoot('beforeAPIRoot');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'http://afterAPIRoot/');

    mount(<ConnectionStringConfigForm />);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(serviceBusConnection.activeServiceBusConString).toEqual('afterConnectionString');
        expect(serviceBusConnection.activeAPIroot).toEqual('http://afterAPIRoot/');
    });
});

it('API root location is formatted correctly', () => {
    serviceBusConnection.setConnectionString('beforeConnectionString');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'afterConnectionString');
    serviceBusConnection.setApiRoot('beforeAPIRoot');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'afterAPIRoot');

    mount(<ConnectionStringConfigForm />);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(serviceBusConnection.activeServiceBusConString).toEqual('afterConnectionString');
        expect(serviceBusConnection.activeAPIroot).toEqual('http://afterAPIRoot/');
    });
});

it('Connect button changes info in info box', () => {
    const wrapper = mount(<ConnectionStringConfigForm />);

    const connectionStringInput = wrapper.find('#connectionString');
    //Actual string contents don't matter
    connectionStringInput.value = "exampleValue";

    const connectionStringButton = wrapper.find('#connectButton').at(0);
    connectionStringButton.simulate('click');

    const infoBox = wrapper.find(ServiceBusInfoBox);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(infoBox.props.name).toEqual(expect.anything());
    });
});

it('ConnectionStringConfigForm renders correctly', () => {
    let configForm = renderer.create(<ConnectionStringConfigForm />);
    expect(configForm.toJSON()).toMatchSnapshot();
});