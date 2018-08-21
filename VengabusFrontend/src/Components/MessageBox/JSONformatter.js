import { BaseFormatter } from './BaseFormatter';

export class JSONformatter {
    constructor() {
        this.BaseFormatter = new BaseFormatter();
    }

    removeWhitespaceFormattingFromJSON = (originalData) => {
        let noInitialWhitespace = originalData.replace(/^ */gm, "");
        let noNewLinesAfterJSONTags = noInitialWhitespace.replace(/}[\n\r]/g, "}");
        let noNewLinesBeforeJSONTags = noNewLinesAfterJSONTags.replace(/[\n\r]{/g, "{");
        let replaceNewlineBySpaces = noNewLinesBeforeJSONTags.replace(/[\n\r]/g, " ");
        return replaceNewlineBySpaces;
    };

    mightBeJSON = (originalText) => {
        return this.BaseFormatter.startsAndEndsWith(originalText, '{', '}') || this.BaseFormatter.startsAndEndsWith(originalText, '[', ']');
    }

    formatJSONtext = (originalText) => {
        let deformattedOriginalText = this.removeWhitespaceFormattingFromJSON(originalText);
        const propertyFilter = null; //include all properties of the JSON string in the output
        const indentSize = 4;
        return this.BaseFormatter.removeBlankLines(JSON.stringify(JSON.parse(deformattedOriginalText), propertyFilter, indentSize));
    }

    getFormatResult = (originalText) => {
        let formattedObj = this.BaseFormatter.formatResult(originalText, 'JSON', this.formatJSONtext, this.mightBeJSON(originalText));
        return formattedObj;
    }
}