export class OriginalFormatter {

    getOriginalConfidenceMatch = () => {
        return 0.1;
    }

    getFormatResult = (originalText) => {
        let formattedObj = { formatType: "original" };
        try {
            formattedObj.formattedText = originalText;
        }
        catch (error) {
            formattedObj.errorMessage = error.toString();
        }
        formattedObj.matchConfidence = this.getOriginalConfidenceMatch();
        return formattedObj;
    }

}