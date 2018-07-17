import 'jest-localstorage-mock';
import { mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import { testHelper } from '../Helpers/testHelper';

import React from 'react';
import { ServiceBusConfigForm, LOCAL_STORAGE_STRINGS } from '../Components/ServiceBusConfigForm';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';

configure({ adapter: new Adaptor() });

// jest.mock('../AzureWrappers/ServiceBusConnection', () => {
//     return {
//         serviceBusConnection: {
//             setConnectionString: (connectionString) => { }
//         }
//     };
// });

it('component renders fine when no localStorage is present', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, undefined);
    const wrapper = mount(<ServiceBusConfigForm />);
});

it('component renders fine when localStorage *is* present', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'some Value');
    const wrapper = mount(<ServiceBusConfigForm />);
});

it('localStore is updated when the form is changed', () => {
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'before');
    const wrapper = mount(<ServiceBusConfigForm />);

    const connectionStringInput = wrapper.find('#connectionString');
    connectionStringInput.simulate('change', { target: {value: 'after'}});

    return testHelper.afterReactHasUpdated().then(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.ConnectionString)).toEqual('after');
    });
});

it('ServiceBusConnection is updated appropriately on page load', () => {
    serviceBusConnection.setConnectionString('before');
    localStorage.setItem(LOCAL_STORAGE_STRINGS.ConnectionString, 'after');

    mount(<ServiceBusConfigForm />);
    return testHelper.afterReactHasUpdated().then(() => {
        expect(serviceBusConnection.activeServiceBusConString).toEqual('after');
    });
});
