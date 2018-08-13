import { MessageBox } from '../../Components/MessageBox';
import React from 'react';

import { shallow } from 'enzyme';

describe('MessageBox', () => {
    it('renders correctly with given props', () => {
        const wrapper = shallow(<MessageBox messageBody="ID" nmessageId="BODY" />);
        expect(wrapper).toMatchSnapshot();
    });

});
