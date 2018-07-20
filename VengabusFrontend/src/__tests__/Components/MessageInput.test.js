import 'jest-localstorage-mock';
import { configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import React from 'react';
import { MessageInput } from '../../Components/MessageInput';

configure({ adapter: new Adaptor() });

//QQ Inplement a test that checks that the body has been added to the message
//once the submitMessage function actually does something

it('renders correctly', () => {
    let messagePropertyInput = renderer.create(
        <MessageInput />);
    expect(messagePropertyInput.toJSON()).toMatchSnapshot();
});