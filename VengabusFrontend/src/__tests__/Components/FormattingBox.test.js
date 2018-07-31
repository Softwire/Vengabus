import { FormattingBox } from '../../Components/FormattingBox';
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';

function expectFormattingOutput(input, expectedOutput, outputBoxId, expectedBoxId, unexpectedBoxId) {
    let formattingBox = mount(
        <FormattingBox
            data={input}
        />);
    expectedBoxId.forEach((value) => {
        expect(formattingBox.find(value).exists()).toBe(true);
    });

    unexpectedBoxId.forEach((value) => {
        expect(formattingBox.find(value).exists()).toBe(false);
    });

    expect(formattingBox.find(outputBoxId).exists()).toBe(true);

    const formattedText = formattingBox.find(outputBoxId);
    expect(formattedText.text()).toBe(expectedOutput);
}

describe('FormattingBox', () => {

    it('renders correctly with given props', () => {
        let formattingBox = renderer.create(
            <FormattingBox
                data="test"
            />);
        expect(formattingBox.toJSON()).toMatchSnapshot();
    });

    it('formats xml correctly', () => {
        let formattingBox = renderer.create(
            <FormattingBox
                data="<a>This is a sample xml message</a>"
            />);
        expect(formattingBox.toJSON()).toMatchSnapshot();
    });

    it('formats json correctly', () => {
        let formattingBox = renderer.create(
            <FormattingBox
                data='{"a":"apple","b":42, "c":false}'
            />);
        expect(formattingBox.toJSON()).toMatchSnapshot();
    });

    it('does not format plain text', () => {
        let formattingBox = renderer.create(
            <FormattingBox
                data='"a":"apple","b":42, "c":false'
            />);
        expect(formattingBox.toJSON()).toMatchSnapshot();
    });

    it('does not change plain text', () => {
        const plainText = 'one kilogram of fish is worth 42';
        const expectedOutput =
            `one kilogram of fish is worth 42`;
        expectFormattingOutput(plainText, expectedOutput, "#originalText", ["#original", "#originalText"], ["#formatted", "#formattedText"]);
    });
    it('it Formatted XML', () => {
        const xmlInput = "<apple><b></b><c>dsagsd{}</c></apple>";
        const expectedOutput =
            `<apple>
    <b>
    </b>
    <c>
        dsagsd{}
    </c>
</apple>`;
        expectFormattingOutput(xmlInput, expectedOutput, "#formattedText", ["#formatted", "#formattedText"], []);
    });

    it('it Formatted JSON', () => {
        const jsonInput = '{"food":"fish", "price":42, "unit":"kilogram"}';
        const expectedOutput =
            `{
    food: "fish",
    price: 42,
    unit: "kilogram"
}
`;
        expectFormattingOutput(jsonInput, expectedOutput, "#formattedText", ["#formatted", "#formattedText"], []);
    });

    it('it Formatted JSON', () => {
        const jsonInput = '["fish",42,"kilogram"]';
        const expectedOutput =
            `[
    "fish",
    42,
    "kilogram"
]
`;
        expectFormattingOutput(jsonInput, expectedOutput, "#formattedText", ["#formatted", "#formattedText"], []);
    });

    it('it failed to format mal-formatted JSON', () => {
        const jsonInput = '{"fish",42,"kilogram"}';
        const expectedOutput = '{"fish",42,"kilogram"}';
        expectFormattingOutput(jsonInput, expectedOutput, "#originalText", ["#original", "#originalText"], ["#formatted", "#formattedText"]);
    });

    it('it failed to format mal-formatted xml', () => {
        const xmlInput = '<a>fish</a><b>42</b>';
        const expectedOutput = '<a>fish</a><b>42</b>';
        expectFormattingOutput(xmlInput, expectedOutput, "#originalText", ["#original", "#originalText"], ["#formatted", "#formattedText"]);
    });

    it('it heals xml with minor format errors', () => {
        const xmlInput = '<c><d>fish=42</c>';
        const expectedOutput =
            `<c>
    <d>
        fish=42
    </d>
</c>`;
        expectFormattingOutput(xmlInput, expectedOutput, "#formattedText", ["#original", "#originalText", "#formatted", "#formattedText"], []);
    });

});
