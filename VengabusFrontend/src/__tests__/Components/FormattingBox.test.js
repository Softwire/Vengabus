import { FormattingBox } from '../../Components/FormattingBox';
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';

describe('FormattingBox', () => {

    it('renders correctly with given props', () => {
        let formattingBox = renderer.create(
            <FormattingBox
                data="test"
            />);
        expect(formattingBox.toJSON()).toMatchSnapshot();
    });

    it('does not change plain text', () => {
        const planeText = "hello this is plain text { } < > hello";
        let formattingBox = mount(
            <FormattingBox
                data={planeText}
            />);
        const formatted = formattingBox.find("#formatted");
        const original = formattingBox.find("#original");
        const originalText = original.find("#originalText");
        expect(originalText.text()).toBe(planeText);
        expect(formatted.exists()).toBe(false);
    });
    it('it Formatted XML', () => {
        const XML = "<apple><b></b><c>dsagsd{}</c></apple>";
        let formattingBox = mount(
            <FormattingBox
                data={XML}
            />);
        expect(formattingBox.find("#formatted").exists()).toBe(true);

        const formatted = formattingBox.find("#formatted");
        const formattedText = formatted.find("#formattedText");
        expect(formattedText.text().replace(/\s/g, "")).toBe(XML);
    });

    it('it Formatted JSON', () => {
        const json = `{"result":true, "count":42}`;
        const Formatted = `{result:true,count:42}`;
        let formattingBox = mount(
            <FormattingBox
                data={json}
            />);
        expect(formattingBox.find("#formatted").exists()).toBe(true);
        const formatted = formattingBox.find("#formatted");
        const formattedText = formatted.find("#formattedText");
        expect(formattedText.text().replace(/\s/g, "")).toBe(Formatted);
    });

    it('it Formatted JSON', () => {
        const json = `[true , 42]`;
        const Formatted = `[true,42]`;
        let formattingBox = mount(
            <FormattingBox
                data={json}
            />);
        expect(formattingBox.find("#formatted").exists()).toBe(true);
        const formatted = formattingBox.find("#formatted");
        const formattedText = formatted.find("#formattedText");
        expect(formattedText.text().replace(/\s/g, "")).toBe(Formatted);
    });

});
