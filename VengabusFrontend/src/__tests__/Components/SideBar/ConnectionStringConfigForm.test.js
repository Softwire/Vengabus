import 'jest-localstorage-mock';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { testHelper } from '../../../TestHelpers/TestHelper';
import React from 'react';
import {
    ConnectionStringConfigForm,
    LOCAL_STORAGE_STRINGS
} from "../../../Components/SideBar/ConnectionStringConfigForm";
import { serviceBusConnection } from '../../../AzureWrappers/ServiceBusConnection';

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

it('ServiceBusConnection is updated from LocalStorage on page load', () => {
    serviceBusConnection.setConnectionString('connStringInConnection');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'connStringInLocalStorage');
    serviceBusConnection.setApiRoot('APIRootInConnection');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'http://APIRootInLocalStorage/');

    mount(<ConnectionStringConfigForm />);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(serviceBusConnection.activeServiceBusConString).toEqual('connStringInLocalStorage');
        expect(serviceBusConnection.activeAPIroot).toEqual('http://APIRootInLocalStorage/');
    });
});

it('API root location is formatted correctly', () => {
    serviceBusConnection.setApiRoot('APIRootInConnection');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'UnformattedAPIRootInLocalStorage');

    mount(<ConnectionStringConfigForm />);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(serviceBusConnection.activeAPIroot).toEqual('http://UnformattedAPIRootInLocalStorage/');
    });
});

it('ConnectionStringConfigForm renders correctly', () => {
    let configForm = renderer.create(<ConnectionStringConfigForm />);
    expect(configForm.toJSON()).toMatchSnapshot();
});