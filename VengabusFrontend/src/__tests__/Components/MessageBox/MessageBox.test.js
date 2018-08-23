import { MessageBox } from '../../../Components/MessageBox/MessageBox';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { EndpointTypes } from '../../../Helpers/EndpointTypes';
import toJson from 'enzyme-to-json';

describe('MessageBox', () => {
    const testMessage = {
        uniqueId: "1a",
        customProperties: { customProp1: "forty-two", customProp2: 42 },
        messageBody: "Hello world!",
        predefinedProperties: { forcePersistence: false, messageId: "test ID", scheduledEnqueueTimeUtc: "0001-01-01T00:00:00Z", sequenceNumber: 45317471370415620, size: 173, state: "Active", timeToLive: "10675199.02:48:05.4775807" }
    };

    const arePanelsCollapsed = (wrapper) => {
        const panels = wrapper.find('#messageBoxModalBody .panel');
        //.find() returns twice the number of elements with the given property as it returns both the React component and the HTML on the page
        const twiceNumberOfCollapsedPanels = panels.find('[aria-expanded=false]').length;
        const twiceNumberOfExpandedPanels = panels.find('[aria-expanded=true]').length;
        if (twiceNumberOfCollapsedPanels === 4 && twiceNumberOfExpandedPanels === 0) {
            return true;
        }
        else if (twiceNumberOfCollapsedPanels === 0 && twiceNumberOfExpandedPanels === 4) {
            return false;
        }
        throw new Error("Could not find the expected number of panels in MessageBox");
    };

    it('renders correctly with given props', () => {
        const wrapper = shallow(<MessageBox
            message={testMessage}
            show
            endpointType={EndpointTypes.QUEUE}
            messageType={EndpointTypes.MESSAGE}
            parentName={'testing'}
            endpointName={'test name'}
            closeParentModal={() => { }}
        />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('the properties panels toggle as expected', () => {
        const wrapper = mount(<MessageBox
            message={testMessage}
            show
            endpointType={EndpointTypes.QUEUE}
            messageType={EndpointTypes.MESSAGE}
            parentName={'testing'}
            endpointName={'test name'}
            closeParentModal={() => { }}
        />);
        //the properties panels should be closed by default
        let plusGlyphicons = wrapper.find("#messageBoxModalBody .panel .panel-heading .glyphicon-plus");
        expect(plusGlyphicons).toHaveLength(2);
        expect(arePanelsCollapsed(wrapper)).toBe(true);

        //clicking on the glyphicons should expand the panels and toggle the glyphicons
        plusGlyphicons.forEach((glyph) => glyph.simulate("click"));
        wrapper.update();
        let minusGlyphicons = wrapper.find("#messageBoxModalBody .panel .panel-heading .glyphicon-minus");
        expect(minusGlyphicons).toHaveLength(2);
        expect(arePanelsCollapsed(wrapper)).toBe(false);

        //clicking on the glyphicons again should collapse the panels and toggle the glyphicons
        minusGlyphicons.forEach((glyph) => glyph.simulate("click"));
        wrapper.update();
        plusGlyphicons = wrapper.find("#messageBoxModalBody .panel .panel-heading .glyphicon-plus");
        expect(plusGlyphicons).toHaveLength(2);
        expect(arePanelsCollapsed(wrapper)).toBe(true);
    });

});
