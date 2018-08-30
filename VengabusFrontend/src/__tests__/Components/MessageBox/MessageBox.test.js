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
        const numberOfCollapsedPanels = panels.find('a.collapsed').length;
        if (numberOfCollapsedPanels === 2 && panels.length === 2) {
            return true;
        }
        else if (numberOfCollapsedPanels === 0 && panels.length === 2) {
            return false;
        }
        throw new Error("Could not find the expected number of panels in MessageBox");
    };

    const countGlyphicons = (wrapper) => {
        const plusGlyphiconCount = wrapper.find("#messageBoxModalBody .panel .panel-heading .glyphicon-plus").length;
        const minusGlyphiconCount = wrapper.find("#messageBoxModalBody .panel .panel-heading .glyphicon-minus").length;
        return { plus: plusGlyphiconCount, minus: minusGlyphiconCount };
    }

    const clickPanelGlyphicons = (wrapper) => {
        const glyphicons = wrapper.find("#messageBoxModalBody .panel .panel-heading .glyphicon");
        glyphicons.forEach((glyph) => glyph.simulate("click"));
    }

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
        expect(countGlyphicons(wrapper)).toEqual({ plus: 2, minus: 0 });
        expect(arePanelsCollapsed(wrapper)).toBe(true);

        //clicking on the glyphicons should expand the panels and toggle the glyphicons
        clickPanelGlyphicons(wrapper);
        wrapper.update();
        expect(countGlyphicons(wrapper)).toEqual({ plus: 0, minus: 2 });
        expect(arePanelsCollapsed(wrapper)).toBe(false);

        //clicking on the glyphicons again should collapse the panels and toggle the glyphicons
        clickPanelGlyphicons(wrapper);
        wrapper.update();
        expect(countGlyphicons(wrapper)).toEqual({ plus: 2, minus: 0 });
        expect(arePanelsCollapsed(wrapper)).toBe(true);
    });

});
