import { MessageBox } from '../../Components/MessageBox';
import React from 'react';
import { mount } from 'enzyme';

describe('MessageBox', () => {
    it('renders correctly with given props', () => {
        const wrapper = mount(<MessageBox messageBody="ID" messageId="BODY" />);
        expect(wrapper).toMatchSnapshot();
    });

});
