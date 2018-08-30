import { BaseFormatter } from './BaseFormatter';

export class JSONformatter {
    constructor() {
        this.BaseFormatter = new BaseFormatter();
    }

    mightBeJSON = (originalText) => {
        return this.BaseFormatter.startsAndEndsWith(originalText, '{', '}') || this.BaseFormatter.startsAndEndsWith(originalText, '[', ']');
    }

    formatJSONtext = (originalText) => {
        const propertyFilter = null; //include all properties of the JSON string in the output
        const indentSize = 4;
        return this.BaseFormatter.removeBlankLines(JSON.stringify(JSON.parse(originalText), propertyFilter, indentSize));
    }

    getFormatResult = (originalText) => {
        let formattedObj = this.BaseFormatter.formatResult(originalText, 'JSON', this.formatJSONtext, this.mightBeJSON(originalText));
        return formattedObj;
    }
}