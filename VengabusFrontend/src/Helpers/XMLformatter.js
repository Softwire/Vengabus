import formatXML from 'xml-formatter';

const removeWhitespaceFormattingFromXML = (originalData) => {
    //remove any white space at the start of a line, as they will be added later in xml formatting.
    let noInitialWhitespace = originalData.replace(/^ */gm, "");

    //if original text is already formatted, there will be newlines between tags. Remove them as they will be added later.
    let noNewLinesAfterXMLTags = noInitialWhitespace.replace(/>[\n\r]/g, ">");
    let noNewLinesBeforeXMLTags = noNewLinesAfterXMLTags.replace(/[\n\r]</g, "<");

    //replace newlines and put things in the same line, as they will be added later. 
    //However, don't completely remove them as there might be genuine newlines in original text, so replace them by spaces.
    let replaceNewlineBySpaces = noNewLinesBeforeXMLTags.replace(/[\n\r]/g, " ");
    return replaceNewlineBySpaces;
}

const removeBlankLines = (text) => {
    if (!text) {
        return text;
    }
    return text.replace(/^\s*\n/gm, "");
}

const matchWithoutWhitespace = (text1, text2) => {
    return text1.replace(/\s/g, "") === text2.replace(/\s/g, "");
}

export function createFormattedXMLobject(originalText) {
    let formattedObj = { formatType: "XML" };
    try {
        let deformattedOriginalText = removeWhitespaceFormattingFromXML(originalText);
        let XMLtext = removeBlankLines(formatXML(deformattedOriginalText));
        formattedObj.formattedText = XMLtext;
        if (XMLtext && (!matchWithoutWhitespace(XMLtext, originalText))) {
            formattedObj.warningMessage = "The XML formatter changed the text of this data. This was probably just to 'heal' malformed XML, but we can't be certain. See below for the original data text.";
        }
    }
    catch (error) {
        formattedObj.errorMessage = error.toString();
    }
    return formattedObj;
}