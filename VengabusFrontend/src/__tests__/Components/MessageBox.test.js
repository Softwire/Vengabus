import { MessageBox } from '../../Components/MessageBox/MessageBox';
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('MessageBox', () => {
    it('renders correctly with given props', () => {
        const wrapper = shallow(
            <MessageBox
                message={{ messageBody: "BODY", predefinedProperties: { messageId: "ID" }, uniqueId: "asdasasd" }}
                endpointName="demoqueue1"
                endpointType="queue"
                show
            />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

});
