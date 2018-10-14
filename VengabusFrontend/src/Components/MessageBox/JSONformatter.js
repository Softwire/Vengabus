import { BaseFormatter } from './BaseFormatter';
import { jsonToFormattedString } from '../../Helpers/FormattingHelpers';

export class JSONformatter {
    constructor() {
        this.BaseFormatter = new BaseFormatter();
    }

    mightBeJSON = (originalText) => {
        return this.BaseFormatter.startsAndEndsWith(originalText, '{', '}') || this.BaseFormatter.startsAndEndsWith(originalText, '[', ']');
    }

    formatJSONtext = (originalText) => {
        return this.BaseFormatter.removeBlankLines(jsonToFormattedString(JSON.parse(originalText)));
    }

    getFormatResult = (originalText) => {
        let formattedObj = this.BaseFormatter.formatResult(originalText, 'JSON', this.formatJSONtext, this.mightBeJSON(originalText));
        return formattedObj;
    }
}