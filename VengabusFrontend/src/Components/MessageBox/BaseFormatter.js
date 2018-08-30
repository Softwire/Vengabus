export class BaseFormatter {
    startsAndEndsWith = (inputString, startCharacter, endCharacter) => {
        let noInitialWhitespace = inputString.replace(/^\s*/g, "");
        let noWrappingWhitespace = noInitialWhitespace.replace(/\s*$/g, "");

        return this.startsAndEndsWith_NotIgnoringWhitespace(noWrappingWhitespace, startCharacter, endCharacter);
    }

    startsAndEndsWith_NotIgnoringWhitespace = (inputString, startCharacter, endCharacter) => {
        if (!inputString) {
            return false;
        }
        if (inputString[0] === startCharacter && inputString[inputString.length - 1] === endCharacter) {
            return true;
        }
        return false;
    }

    isMessageTooLong = (originalText) => {
        return originalText && originalText.length > 100000;
    }

    removeBlankLines = (text) => {
        if (!text) {
            return text;
        }
        return text.replace(/^\s*\n/gm, "");
    };

    matchWithoutWhitespaceAndQuotes = (text1, text2) => {
        //ignore quote marks as the JSON formatter sometimes removes these
        return text1.replace(/\s|'|"|`/g, "") === text2.replace(/\s|'|"|`/g, "");
    }

    getConfidenceMatch = (formattedObj, mightBeThisFormat) => {
        //return a float between 0 and 1 indicating how confident we are that the message is of the given format
        if (mightBeThisFormat && !formattedObj.errorMessage) {
            return formattedObj.warningMessage ? 0.5 : 0.9;
        }
        return 0;
    }

    formatResult = (originalText, title, formattingFunction, mightBeThisFormat) => {
        let formattedObj = { formatType: title };
        formattedObj.isMessageTooLongToFormat = this.isMessageTooLong(originalText);
        if (formattedObj.isMessageTooLongToFormat) {
            formattedObj.errorMessage = 'Long message: only messages under 100,000 characters in length are formatted.';
        } else {
            try {
                formattedObj.formattedText = formattingFunction(originalText);
                if (formattedObj.formattedText && !this.matchWithoutWhitespaceAndQuotes(formattedObj.formattedText, originalText)) {
                    formattedObj.warningMessage = `The ${title} formatter changed the text of this data. This was probably just to 'heal' malformed ${title}, but we can't be certain.`;
                }
            }
            catch (error) {
                formattedObj.errorMessage = error.toString();
            }
        }
        formattedObj.matchConfidence = this.getConfidenceMatch(formattedObj, mightBeThisFormat);
        return formattedObj;
    }
}