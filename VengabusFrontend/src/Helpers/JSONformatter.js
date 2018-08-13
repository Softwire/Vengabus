import formatJSon from 'prettyprint/dist/prettyPrintObject';

const removeWhitespaceFormattingFromJSON = (originalData) => {
    let noInitialWhitespace = originalData.replace(/^ */gm, "");
    let noNewLinesAfterJSONTags = noInitialWhitespace.replace(/}[\n\r]/g, "}");
    let noNewLinesBeforeJSONTags = noNewLinesAfterJSONTags.replace(/[\n\r]{/g, "{");
    let replaceNewlineBySpaces = noNewLinesBeforeJSONTags.replace(/[\n\r]/g, " ");
    return replaceNewlineBySpaces;
};

const removeBlankLines = (text) => {
    if (!text) {
        return text;
    }
    return text.replace(/^\s*\n/gm, "");
};

export function createFormattedJSONobject(originalText) {
    let formattedObj = { formatType: "JSON" };
    try {
        let deformattedOriginalText = removeWhitespaceFormattingFromJSON(originalText);
        formattedObj.formattedText = removeBlankLines(formatJSon(JSON.parse(deformattedOriginalText)));
    }
    catch (error) {
        formattedObj.errorMessage = error.toString();
    }
    return formattedObj;
}