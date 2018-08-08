import { MessageBox } from '../../Components/MessageBox';
import renderer from 'react-test-renderer';
import React from 'react';

describe('MessageBox', () => {

    const showMessage = true;
    const message = { predefinedProperties: [{ messageId: 'id1' }], messageBody: "Hello world!", customProperties: [{ userDefinedProp1: "value 1" }, { userDefinedProp2: "value 2" }] };

    it('renders correctly with given props', () => {
        let messageBox = renderer.create(
            <MessageBox
                message={message}
            />);
        expect(messageBox.toJSON()).toMatchSnapshot();
    });

});
