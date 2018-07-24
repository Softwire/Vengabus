import { PrettyXMLBox } from '../../Components/PrettyXMLBox';
import renderer from 'react-test-renderer';
import React from 'react';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
configure({ adapter: new Adaptor() });

describe('PrettyXMLBox', () => {

    it('renders correctly with given props', () => {
        let prettyXMLBox = renderer.create(
            <PrettyXMLBox
                xml="<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>"
            />);
        expect(prettyXMLBox.toJSON()).toMatchSnapshot();
    });

});
