import formatJSon from 'prettyprint/dist/prettyPrintObject';

function removeWhitespaceFormattingFromJSON(originalData) {
    //More or less the same as above
    let noInitialWhitespace = originalData.replace(/^ */gm, "");
    let noNewLinesAfterJSONTags = noInitialWhitespace.replace(/}[\n\r]/g, "}");
    let noNewLinesBeforeJSONTags = noNewLinesAfterJSONTags.replace(/[\n\r]{/g, "{");
    let replaceNewlineBySpaces = noNewLinesBeforeJSONTags.replace(/[\n\r]/g, " ");
    return replaceNewlineBySpaces;
}