import 'jest-localstorage-mock';
import { mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import { testHelper } from '../Helpers/testHelper';

import React from 'react';
import { ServiceBusConfigForm, LOCAL_STORAGE_STRINGS } from '../Components/ServiceBusConfigForm';

configure({ adapter: new Adaptor() });

jest.mock('../AzureWrappers/ServiceBusConnection', () => {
    return {
        serviceBusConnection: {
            setConnectionString: (connectionString) => {}
        }
    };
});

it('store connection string in localStore', () => {
    const wrapper = mount(<ServiceBusConfigForm />);

    const connectionStringInput = wrapper.find('#connectionString');
    connectionStringInput.value = 'test';
    connectionStringInput.simulate('change');

    testHelper.afterReactHasUpdated(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.ConnectionString)).toEqual('test');
    });
});
