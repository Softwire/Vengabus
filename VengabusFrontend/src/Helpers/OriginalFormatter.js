export class OriginalFormatter {

    getFormatResult = (originalText) => {
        return {
            formatType: "Original",
            formattedText: originalText,
            matchConfidence: 0.1
        };
    }

}