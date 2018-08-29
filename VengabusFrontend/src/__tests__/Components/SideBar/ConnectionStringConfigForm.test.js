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
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionStrings, 'some Value');
    const wrapper = mount(<ConnectionStringConfigForm />);
});

it('localStorage should not be updated without clicking the connect button', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionStrings, '{value:"before",label:"before"}');
    const wrapper = mount(<ConnectionStringConfigForm />);

    //Cannot use the id of the form to find it because the wrapper then contains two elements instead of one
    //Not sure why this happens
    const connectionStringInput = wrapper.find('input[placeholder="Enter Connection String"]');
    connectionStringInput.simulate('change', { target: { value: 'after' } });

    return testHelper.afterReactHasUpdated().then(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.ConnectionStrings)).toEqual('{value:"before",label:"before"}');
    });
});

it('localStorage should not be updated without clicking the connect button', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'before');
    const wrapper = mount(<ConnectionStringConfigForm />);

    //Cannot use the id of the form to find it because the wrapper then contains two elements instead of one
    //Not sure why this happens
    const connectionStringInput = wrapper.find('#APILocationForm');
    connectionStringInput.simulate('change', { target: { value: 'after' } });

    return testHelper.afterReactHasUpdated().then(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.APIroot)).toEqual('before');
    });
});

it('ServiceBusConnection is updated from LocalStorage on page load', () => {
    serviceBusConnection.setConnectionString('connStringInConnection');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionStrings, '{value:"connStringInLocalStorage",label:"connStringInLocalStorage"}');
    serviceBusConnection.setApiRoot('APIRootInConnection');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'http://APIRootInLocalStorage/');

    let wrapper = mount(<ConnectionStringConfigForm />);
    wrapper.update();
    return testHelper.afterReactHasUpdated().then(() => {
        //this seems to take really a while... alternative use two or three afterReactHasUpdate().then probably works
        setTimeout(() => {
            expect(serviceBusConnection.activeServiceBusConString).toEqual('connStringInLocalStorage');
            expect(serviceBusConnection.activeAPIroot).toEqual('http://APIRootInLocalStorage/');
        }, 10);
    });
});

it('API root location is formatted correctly', () => {
    serviceBusConnection.setApiRoot('APIRootInConnection');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.APIroot, 'UnformattedAPIRootInLocalStorage');

    mount(<ConnectionStringConfigForm />);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(serviceBusConnection.activeAPIroot).toEqual('//UnformattedAPIRootInLocalStorage/');
    });
});

it('ConnectionStringConfigForm renders correctly', () => {
    let configForm = renderer.create(<ConnectionStringConfigForm />);
    expect(configForm.toJSON()).toMatchSnapshot();
});