import { MessageBox } from '../../Components/MessageBox';
import renderer from 'react-test-renderer';
import React from 'react';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
configure({ adapter: new Adaptor() });

describe('MessageBox', () => {

   it('renders correctly with given props', () => {
        let messageBox = renderer.create(
            <MessageBox
                messageBody={"Message id"}
               messageId={"Message"}
                show={true}
               handleClose={undefined}
           />);
        expect(messageBox.toJSON()).toMatchSnapshot();
    });

});