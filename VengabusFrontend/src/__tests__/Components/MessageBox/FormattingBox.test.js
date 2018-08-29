import { FormattingBox } from '../../../Components/MessageBox/FormattingBox';
import renderer from 'react-test-renderer';
import React from 'react';
import { mount, shallow } from 'enzyme';

function expectFormattedResult(inputMessage, expectedOutput, formatName) {
    const formattingBox = mount(<FormattingBox message={inputMessage} />);
    const originalText = formattingBox.find("#Original");
    const formattedText = formattingBox.find("#" + formatName);
    expect(originalText.text()).toBe(inputMessage);
    expect(formattedText.text()).toBe(expectedOutput);
    expect(formattingBox.find('li.active').last().text()).toEqual(formatName);
}

function expectOriginalOutput(inputMessage) {
    expectFormattedResult(inputMessage, inputMessage, 'Original');
}

function expectXMLoutput(inputMessage, expectedOutput) {
    expectFormattedResult(inputMessage, expectedOutput, 'XML');
}

function expectJSONoutput(inputMessage, expectedOutput) {
    expectFormattedResult(inputMessage, expectedOutput, 'JSON');
}

function getOriginalerror(inputMessage) {
    return getAlertMessage(inputMessage, '#Originalerror');
}

function getXMLerror(inputMessage) {
    return getAlertMessage(inputMessage, '#XMLerror');
}

function getXMLwarning(inputMessage) {
    return getAlertMessage(inputMessage, '#XMLwarning');
}

function getJSONerror(inputMessage) {
    return getAlertMessage(inputMessage, '#JSONerror');
}

function getAlertMessage(inputMessage, errorId) {
    const formattingBox = shallow(<FormattingBox message={inputMessage} />);
    const errorMessageLines = formattingBox.find(errorId).children();
    return errorMessageLines.reduce((messageSoFar, nextLine) => messageSoFar + nextLine.text(), '');
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

    describe('formats plain text correctly', () => {
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

        it('does not remove leading whitespace from plain text', () => {
            const plainText = `     one kilogram of fish is worth 42`;
            expectOriginalOutput(plainText);
        });

        it('does not remove trailing whitespace from plain text', () => {
            const plainText = `one kilogram of fish is worth 42    `;
            expectOriginalOutput(plainText);
        });
    });

    describe('formats XML correctly', () => {
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

        it('formats XML with leading whitespace', () => {
            const xmlInput = `    <apple>    <b>    </b>    <c>#        dsagsd{}    #</c></apple>`;
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

        it('formats XML with trailing whitespace', () => {
            const xmlInput = `<apple>    <b>    </b>    <c>#        dsagsd{}    #</c></apple>    `;
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

        it('formats XML that is already correctly formatted', () => {
            const xmlInput = `<apple>
    <b>
    </b>
    <c>
        dsa gsd
    </c>
</apple>`;
            expectXMLoutput(xmlInput, xmlInput);
        });

        it('heals xml with minor format errors', () => {
            const xmlInput = '<c><d>fish=42</c>';
            const expectedOutput =
                `<c>
    <d>
        fish=42
    </d>
</c>`;
            const expectedError = "The formatter returned a warning whilst trying to format the text of this data:The XML formatter changed the text of this data. This was probably just to 'heal' malformed XML, but we can't be certain.See \"Original Text\" for the unformatted data.";
            expectXMLoutput(xmlInput, expectedOutput);
            expect(getXMLwarning(xmlInput)).toBe(expectedError);
        });
    });

    describe('formats JSON correctly', () => {
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

        it('formats JSON that had extra spaces between tags', () => {
            const jsonInput =
                `     {
            "food"    :     "fi  sh",
        "pr  ice": {
            "GBP": 42,
            "USD": 54
        }     ,   
        "unit": "kilogram"    
        }    `;
            const expectedOutput =
                `{
    "food": "fi  sh",
    "pr  ice": {
        "GBP": 42,
        "USD": 54
    },
    "unit": "kilogram"
}`;
            expectJSONoutput(jsonInput, expectedOutput);
        });

        it('formats JSON with leading whitespace', () => {
            const jsonInput = `           {
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

        it('formats JSON with trailing whitespace', () => {
            const jsonInput = `{
        "food": "fish",
        "price": {
            "GBP": 42,
            "USD": 54
        },
        "unit": "kilogram"
    }       `;
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

        it('formats JSON with whitespace between values', () => {
            const jsonInput = `{
         "food"   :    "fish",
        "price": {   
            "GBP":    42,
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

        it('formats JSON with linebreaks outside of keys and values', () => {
            const jsonInput = `{

        "food": "fish", 
        "price": {
            "GBP": 42,

            "USD": 54
        }
        ,

        "unit"
        :
        "kilogram"

        
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

        it('formats JSON with tabs not inside strings', () => {
            const jsonInput = `{\t
        "food"\t: "fish",
        "price": {
            \t"GBP":\t 42\t,\t
            "USD"\t: 54\t
        }\t,\t
        "unit":\t "kilogram"
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
    });

    describe('handles errors correctly', () => {
        it('fails to format JSON with tabs inside keys', () => {
            //because having tabs in keys is not valid JSON. See https://stackoverflow.com/questions/19799006/unable-to-parse-tab-in-json-files
            const jsonInput =
                `{
        "fo\tod": "fish",
        "price": {
            "GBP": 42,
            "USD": 54
        },
        "unit": "kilogram"
    }`;
            expect(getJSONerror(jsonInput)).toBe('The formatter threw an error whilst trying to format the text of this data:SyntaxError: Unexpected token \t in JSON at position 13');
        });

        it('fails to format JSON with tabs inside values', () => {
            //because having tabs inside values not valid JSON. See above.
            const jsonInput =
                `{
        "food": "fish",
        "price": {
            "GBP": 42,
            "USD": 54
        },
        "unit": "kilo\tgram"
    }`;
            expect(getJSONerror(jsonInput)).toBe('The formatter threw an error whilst trying to format the text of this data:SyntaxError: Unexpected token \t in JSON at position 122');
        });

        it('fails to format mal-formatted JSON', () => {
            const jsonInput = '{"fish",42,"kilogram"}';
            expect(getJSONerror(jsonInput)).toBe('The formatter threw an error whilst trying to format the text of this data:SyntaxError: Unexpected token , in JSON at position 7');
        });

        it('fails to format JSON with linebreaks in keys', () => { //qq JF fix this!!!
            const jsonInput = `{
        "f\nood": "fish", 
        "price": {
            "GBP": 42,
            "USD": 54
        },
        "unit": "kilogram"
    }`;
            expect(getJSONerror(jsonInput)).toBe('The formatter threw an error whilst trying to format the text of this data:SyntaxError: Unexpected token \n in JSON at position 12');
        });

        it('fails to format JSON with linebreaks in keys', () => { //qq JF fix this!!!
            const jsonInput = `{
        "food": "fi\nsh", 
        "price": {
            "GBP": 42,

            "USD": 54
        }
        ,

        "unit"
        :
        "kilogram"
    }`;
            expect(getJSONerror(jsonInput)).toBe('The formatter threw an error whilst trying to format the text of this data:SyntaxError: Unexpected token \n in JSON at position 21');
        });

        it('fails to format mal-formatted xml', () => {
            const xmlInput = '<a>fish</a><b>42</b>';
            expect(getXMLerror(xmlInput)).toBe('The formatter threw an error whilst trying to format the text of this data:Error: Found multiple root nodes');
        });

        it('fails to format messages over 100k', () => {
            const input = 'a'.repeat(100001);
            const longMessageError = "The formatter threw an error whilst trying to format the text of this data:Long message: only messages under 100,000 characters in length are formatted.";
            expect(getXMLerror(input)).toBe(longMessageError);
            expect(getJSONerror(input)).toBe(longMessageError);
        });

        it('fails to format empty messages', () => {
            const input = '';
            expect(getOriginalerror(input)).toBe("The formatter didn't return any text to display.");
            expect(getXMLerror(input)).toBe("The formatter didn't return any text to display.");
            expect(getJSONerror(input)).toBe("The formatter threw an error whilst trying to format the text of this data:SyntaxError: Unexpected end of JSON input");
        });

        it('fails to format undefined messages', () => {
            const input = undefined;
            expect(getOriginalerror(input)).toBe("The formatter didn't return any text to display.");
            expect(getXMLerror(input)).toBe("The formatter didn't return any text to display.");
            expect(getJSONerror(input)).toBe("The formatter threw an error whilst trying to format the text of this data:SyntaxError: Unexpected end of JSON input");
        });
    });
});