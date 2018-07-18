import 'jest-localstorage-mock';
import { mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import { testHelper } from '../Helpers/testHelper';

import React from 'react';
import {
  ConnectionStringConfigForm,
  LOCAL_STORAGE_STRINGS
} from "../Components/ConnectionStringConfigForm";
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

configure({ adapter: new Adaptor() });

it('component renders fine when no localStorage is present', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, undefined);
    const wrapper = mount(<ConnectionStringConfigForm />);
});

it('component renders fine when localStorage *is* present', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'some Value');
    const wrapper = mount(<ConnectionStringConfigForm />);
});

it('localStore is updated when the form is changed', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'before');
    const wrapper = mount(<ConnectionStringConfigForm />);

    const connectionStringInput = wrapper.find('#connectionString');
    connectionStringInput.simulate('change', { target: { value: 'after' } });

    return testHelper.afterReactHasUpdated().then(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.ConnectionString)).toEqual('after');
    });
});

it('ServiceBusConnection is updated appropriately on page load', () => {
    serviceBusConnection.setConnectionString('before');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'after');

    mount(<ConnectionStringConfigForm />);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(serviceBusConnection.activeServiceBusConString).toEqual('after');
    });
});
