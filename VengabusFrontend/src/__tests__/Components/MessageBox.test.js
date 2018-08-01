import { MessageBox } from '../../Components/MessageBox';
import renderer from 'react-test-renderer';
import React from 'react';
import '../../TestHelpers/TestConfigAndHelpers';

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
