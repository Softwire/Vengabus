import formatXML from 'xml-formatter';
import { BaseFormatter } from './BaseFormatter';

export class XMLformatter {
    constructor() {
        this.BaseFormatter = new BaseFormatter();
    }

    removeWhitespaceFormattingFromXML = (originalData) => {
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

    mightBeXML = (originalText) => {
        return this.BaseFormatter.startsAndEndsWith(originalText, '<', '>');
    }

    formatXMLtext = (originalText) => {
        let deformattedOriginalText = this.removeWhitespaceFormattingFromXML(originalText);
        return this.BaseFormatter.removeBlankLines(formatXML(deformattedOriginalText));
    }

    getFormatResult = (originalText) => {
        let formattedObj = this.BaseFormatter.formatResult(originalText, 'XML', this.formatXMLtext, this.mightBeXML(originalText));
        return formattedObj;
    }

}