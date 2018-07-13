import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import { ServiceBusConfigForm, LOCAL_STORAGE_STRINGS } from '../Components/ServiceBusConfigForm';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import 'jest-localstorage-mock';
import { mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';

configure({ adapter: new Adaptor() });

jest.mock('../AzureWrappers/ServiceBusConnection', () => {
    return {
        serviceBusConnection: {
                setConnectionString: (connectionString) => { }
        }
    }
});

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});

it('store connection string in localStore', () => {
    const wrapper = mount(<ServiceBusConfigForm />);

    const connectionStringInput = wrapper.find('#connectionString');
    connectionStringInput.value = "test";
    connectionStringInput.simulate("change");

    setTimeout(() => {
        expect(localStorage.getItem(LOCAL_STORAGE_STRINGS.ConnectionString)).toEqual("test");
    }, 0);


});
