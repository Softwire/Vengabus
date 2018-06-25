export default function promisifyCallBack (functionThatTakesACallBack){
    return new Promise((resolve, reject) => {
        try {
            functionThatTakesACallBack((errorResponse, resultResponse) => {
                if (errorResponse) {
                    reject(errorResponse);
                }
                resolve(resultResponse);
            });
        } catch (errorThrown) {
            reject(errorThrown);
        }
    });
}