import { css } from 'react-emotion';

export class OriginalFormatter {

    getFormatResult = (originalText) => {
        return {
            formatType: "Original",
            formattedText: originalText,
            matchConfidence: 0.1,
            preTagClassName: css`white-space: pre-wrap;`
        };
    }

}