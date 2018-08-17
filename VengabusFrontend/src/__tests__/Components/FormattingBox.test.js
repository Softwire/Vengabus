import { FormattingBox } from '../../Components/FormattingBox';
import renderer from 'react-test-renderer';
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

function expectFormattedResult(inputMessage, expectedOutput, formatId) {
    const formattingBox = shallow(<FormattingBox message={inputMessage} />);
    expect(formattingBox.find(formatId)).toExistOnPage();
    const formattedText = formattingBox.find(formatId);
    expect(formattedText.text()).toBe(expectedOutput);
}

function expectOriginalOutput(inputMessage) {
    expectFormattedResult(inputMessage, inputMessage, '#Original');
}

function expectXMLoutput(inputMessage, expectedOutput) {
    expectFormattedResult(inputMessage, expectedOutput, '#XML');
}

function expectJSONoutput(inputMessage, expectedOutput) {
    expectFormattedResult(inputMessage, expectedOutput, '#JSON');
}

describe('FormattingBox', () => {

    describe('renders a snapshot correctly when given', () => {
        it('props', () => {
            let formattingBox = renderer.create(
                <FormattingBox
                    message="test"
                />);
            expect(formattingBox.toJSON()).toMatchSnapshot();
        });

        it('xml', () => {
            let formattingBox = renderer.create(
                <FormattingBox
                    message="<a>This is a sample xml message</a>"
                />);
            expect(formattingBox.toJSON()).toMatchSnapshot();
        });

        it('json', () => {
            let formattingBox = renderer.create(
                <FormattingBox
                    message='{"a":"apple","b":42, "c":false}'
                />);
            expect(formattingBox.toJSON()).toMatchSnapshot();
        });

        it('plain text', () => {
            let formattingBox = renderer.create(
                <FormattingBox
                    message='"a":"apple","b":42, "c":false'
                />);
            expect(formattingBox.toJSON()).toMatchSnapshot();
        });
    });

    it('does not change plain text', () => {
        const plainText = 'one kilogram of fish is worth 42';
        expectOriginalOutput(plainText);
    });

    it('does not change plain text with line breaks', () => {
        const plainText = `one kilogram
of fish
is worth 42`;
        expectOriginalOutput(plainText);
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
        expectXMLoutput(xmlInput, expectedOutput);
    });

    it('it Formatted XML with real spaces in', () => {
        const xmlInput = "<apple><b>Some random sentence</b></apple>";
        const expectedOutput =
            `<apple>
    <b>
        Some random sentence
    </b>
</apple>`;
        expectXMLoutput(xmlInput, expectedOutput);
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
        expectXMLoutput(xmlInput, expectedOutput);
    });

    it('formats XML with tabs in text', () => {
        const xmlInput = `<apple><b>Some random sentence with \t tabs in text</b></apple>`;
        const expectedOutput =
            `<apple>
    <b>
        Some random sentence with \t tabs in text
    </b>
</apple>`;
        expectXMLoutput(xmlInput, expectedOutput);
    });

    it('formats XML with tabs between tags', () => {
        const xmlInput = `<apple>\t<b>Some indented tag</b></apple>`;
        const expectedOutput =
            `<apple>
    <b>
        Some indented tag
    </b>
</apple>`;
        expectXMLoutput(xmlInput, expectedOutput);
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
        expectXMLoutput(xmlInput, expectedOutput);
    });

    it('formats XML that was already correctly formatted', () => {
        const xmlInput = `<apple>
    <b>
    </b>
    <c>
        dsa gsd
    </c>
</apple>`;
        expectXMLoutput(xmlInput, xmlInput);
    });

    it('formats simple JSON object', () => {
        const jsonInput = '{"food":"fish", "price":42, "unit":"kilogram"}';
        const expectedOutput =
            `{
    "food": "fish",
    "price": 42,
    "unit": "kilogram"
}`;
        expectJSONoutput(jsonInput, expectedOutput);
    });

    it('formats simple JSON object with complex keys', () => {
        const jsonInput = '{"food-test":"fish", "price test":42, "unit.test":"kilogram"}';
        const expectedOutput =
            `{
    "food-test": "fish",
    "price test": 42,
    "unit.test": "kilogram"
}`;
        expectJSONoutput(jsonInput, expectedOutput);
    });

    it('formats simple JSON array', () => {
        const jsonInput = '["fish",42,"kilogram"]';
        const expectedOutput =
            `[
    "fish",
    42,
    "kilogram"
]`;
        expectJSONoutput(jsonInput, expectedOutput);
    });

    it('formats nested JSON object', () => {
        const jsonInput = '{"food":"fish", "price":{"GBP":42, "USD":54}, "unit":"kilogram"}';
        const expectedOutput =
            `{
    "food": "fish",
    "price": {
        "GBP": 42,
        "USD": 54
    },
    "unit": "kilogram"
}`;
        expectJSONoutput(jsonInput, expectedOutput);
    });

    it('formats mixed JSON array', () => {
        const jsonInput = '["fish",{"GBP":42, "USD":54},"kilogram",false]';
        const expectedOutput =
            `[
    "fish",
    {
        "GBP": 42,
        "USD": 54
    },
    "kilogram",
    false
]`;
        expectJSONoutput(jsonInput, expectedOutput);
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
    "food": "fish",
    "price": {
        "GBP": 42,
        "USD": 54
    },
    "unit": "kilogram"
}`;
        expectJSONoutput(jsonInput, expectedOutput);
    });

    it('should fail to format mal-formatted JSON', () => { //qq JF make this test nicer
        const jsonInput = '{"fish",42,"kilogram"}';
        const formattingBox = shallow(<FormattingBox message={jsonInput} />);
        expect(formattingBox.find('#JSONerror')).toExistOnPage();
        const JSONerror = formattingBox.find('#JSONerror');
        expect(toJson(JSONerror)).toMatchSnapshot();
    });

    it('should fail to format mal-formatted xml', () => { //qq JF make this test nicer
        const xmlInput = '<a>fish</a><b>42</b>';
        const formattingBox = shallow(<FormattingBox message={xmlInput} />);
        expect(formattingBox.find('#XMLerror')).toExistOnPage();
        const XMLerror = formattingBox.find('#XMLerror');
        expect(toJson(XMLerror)).toMatchSnapshot();
    });

    it('heals xml with minor format errors', () => {
        const xmlInput = '<c><d>fish=42</c>';
        const expectedOutput =
            `<c>
    <d>
        fish=42
    </d>
</c>`;
        expectXMLoutput(xmlInput, expectedOutput);
    });

});
