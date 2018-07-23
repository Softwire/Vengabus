import { MessageBox } from '../../Components/MessageBox';
import renderer from 'react-test-renderer';
import React from 'react';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
configure({ adapter: new Adaptor() });

describe('MessageBox', () => {

    const showMessage = true;


    it('renders correctly with given props', () => {
        let messageBox = renderer.create(
            <MessageBox
                messageBody="ID"
                messageId="BODY"
            />);
        expect(messageBox.toJSON()).toMatchSnapshot();
    });

});
