import { FormattingBox } from '../../Components/FormattingBox';
import renderer from 'react-test-renderer';
import React from 'react';
import { mount } from 'enzyme';

function expectFormattingOutput(input, expectedOutput, outputBoxId, expectedBoxIds, unexpectedBoxIds) {
    let formattingBox = mount(
        <FormattingBox
            data={input}
        />);
    expectedBoxIds.forEach((value) => {
        expect(formattingBox.find(value).exists()).toBe(true);
    });

    unexpectedBoxIds.forEach((value) => {
        expect(formattingBox.find(value).exists()).toBe(false);
    });

    expect(formattingBox.find(outputBoxId).exists()).toBe(true);

    const formattedText = formattingBox.find(outputBoxId);
    expect(formattedText.text()).toBe(expectedOutput);
}

function expectFormattedResult(input, expectedOutput) {
    expectFormattingOutput(input, expectedOutput, "#formattedText", ["#formatted", "#formattedText"], []);
}

function expectNoFormattedResult(input) {
    expectFormattingOutput(input, input, "#originalText", ["#original", "#originalText"], ["#formatted", "#formattedText"]);
}

describe('FormattingBox', () => {

    describe('renders a snapshot correctly when given', () => {
        it('renders correctly with given props', () => {
            let formattingBox = renderer.create(
                <FormattingBox
                    data="test"
                />);
            expect(formattingBox.toJSON()).toMatchSnapshot();
        });

        it('renders correctly when given xml', () => {
            let formattingBox = renderer.create(
                <FormattingBox
                    data="<a>This is a sample xml message</a>"
                />);
            expect(formattingBox.toJSON()).toMatchSnapshot();
        });

        it('renders correctly when given json', () => {
            let formattingBox = renderer.create(
                <FormattingBox
                    data='{"a":"apple","b":42, "c":false}'
                />);
            expect(formattingBox.toJSON()).toMatchSnapshot();
        });
    });
    it('renders correctly when given plain text', () => {
        let formattingBox = renderer.create(
            <FormattingBox
                data='"a":"apple","b":42, "c":false'
            />);
        expect(formattingBox.toJSON()).toMatchSnapshot();
    });

    it('does not change plain text', () => {
        const plainText = 'one kilogram of fish is worth 42';
        expectNoFormattedResult(plainText);
    });

    it('does not change plain text', () => {
        const plainText = `one kilogram
of fish
is worth 42`;
        expectNoFormattedResult(plainText);
    });

    it('formats general XML', () => {
        const xmlInput = "<apple><b></b><c>dsagsd{}</c></apple>";
        const expectedOutput =
            `<apple>
    <b>
    </b>
    <c>
        dsagsd{}
    </c>
</apple>`;
        expectFormattedResult(xmlInput, expectedOutput);
    });

    it('it Formatted XML with real spaces in', () => {
        const xmlInput = "<apple><b>Some random sentence</b></apple>";
        const expectedOutput =
            `<apple>
    <b>
        Some random sentence
    </b>
</apple>`;
        expectFormattedResult(xmlInput, expectedOutput);
    });

    it('formats XML with linebreaks in sentences', () => {
        const xmlInput = `<apple><b>Some random sentence
with linebreaks</b></apple>`;
        const expectedOutput =
            `<apple>
    <b>
        Some random sentence with linebreaks
    </b>
</apple>`;
        expectFormattedResult(xmlInput, expectedOutput);
    });

    it('formats XML with tabs in text', () => {
        const xmlInput = `<apple><b>Some random sentence with \t tabs in text</b></apple>`;
        const expectedOutput =
            `<apple>
    <b>
        Some random sentence with \t tabs in text
    </b>
</apple>`;
        expectFormattedResult(xmlInput, expectedOutput);
    });

    it('formats XML with tabs between tags', () => {
        const xmlInput = `<apple>\t<b>Some indented tag</b></apple>`;
        const expectedOutput =
            `<apple>
    <b>
        Some indented tag
    </b>
</apple>`;
        expectFormattingOutput(xmlInput, expectedOutput, "#formattedText", ["#formatted", "#formattedText"], []);
    });

    it('formats XML that had extra spaces between tags', () => {
        const xmlInput = `<apple>    <b>    </b>    <c>#        dsagsd{}    #</c></apple>`;
        const expectedOutput =
            `<apple>
    <b>
    </b>
    <c>
        #        dsagsd{}    #
    </c>
</apple>`;
        expectFormattedResult(xmlInput, expectedOutput);
    });

    it('formats XML that was already correctly formatted', () => {
        const xmlInput = `<apple>
    <b>
    </b>
    <c>
        dsa gsd
    </c>
</apple>`;
        const expectedOutput =
            `<apple>
    <b>
    </b>
    <c>
        dsa gsd
    </c>
</apple>`;
        expectFormattedResult(xmlInput, expectedOutput);
    });

    it('formats simple JSON object', () => {
        const jsonInput = '{"food":"fish", "price":42, "unit":"kilogram"}';
        const expectedOutput =
            `{
    food: "fish",
    price: 42,
    unit: "kilogram"
}
`;
        expectFormattedResult(jsonInput, expectedOutput);
    });

    it('formats simple JSON array', () => {
        const jsonInput = '["fish",42,"kilogram"]';
        const expectedOutput =
            `[
    "fish",
    42,
    "kilogram"
]
`;
        expectFormattedResult(jsonInput, expectedOutput);
    });

    it('formats nested JSON object', () => {
        const jsonInput = '{"food":"fish", "price":{"GBP":42, "USD":54}, "unit":"kilogram"}';
        const expectedOutput =
            `{
    food: "fish",
    price: {
        GBP: 42,
        USD: 54
    },
    unit: "kilogram"
}
`;
        expectFormattedResult(jsonInput, expectedOutput);
    });

    it('formats mixed JSON array', () => {
        const jsonInput = '["fish",{"GBP":42, "USD":54},"kilogram",false]';
        const expectedOutput =
            `[
    "fish",
    {
        GBP: 42,
        USD: 54
    },
    "kilogram",
    false
]
`;
        expectFormattedResult(jsonInput, expectedOutput);
    });

    it('formats JSON that is already formatted', () => {
        const jsonInput = `{
            "food": "fish",
            "price": {
                "GBP": 42,
                "USD": 54
        },
            "unit": "kilogram"
    }`;
        const expectedOutput =
            `{
    food: "fish",
    price: {
        GBP: 42,
        USD: 54
    },
    unit: "kilogram"
}
`;
        expectFormattedResult(jsonInput, expectedOutput);
    });

    it('should fail to format mal-formatted JSON', () => {
        const jsonInput = '{"fish",42,"kilogram"}';
        expectNoFormattedResult(jsonInput);
    });

    it('should fail to format mal-formatted xml', () => {
        const xmlInput = '<a>fish</a><b>42</b>';
        expectNoFormattedResult(xmlInput);
    });

    it('heals xml with minor format errors', () => {
        const xmlInput = '<c><d>fish=42</c>';
        const expectedOutput =
            `<c>
    <d>
        fish=42
    </d>
</c>`;
        expectFormattedResult(xmlInput, expectedOutput);
        expectFormattingOutput(xmlInput, xmlInput, "#originalText", ["#original", "#originalText"], []);
    });

});
