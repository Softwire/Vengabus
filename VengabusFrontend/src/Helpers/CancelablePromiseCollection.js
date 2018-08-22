export class cancelablePromiseCollection {
    constructor() {
        this.collection = [];
    }


    newPromise = (promise) => {
        const prom = this.makeCancelable(promise);
        this.collection.push(prom);
        return prom;
    }

    cancelPromise = (promise) => {
        const index = this.collection.indexOf(promise);
        if (index) {
            this.collection.splice(index, 1);
        }
        promise.cancel();
    }

    cancelAllPromises = () => {
        this.collection.forEach(promise =>
            promise.cancel()
        );
        this.collection = [];
    }

    makeCancelable = (promise) => {
        let hasCanceled_ = false;

        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then(
                val => hasCanceled_ ? reject({ isCanceled: true }) : resolve(val),
                error => hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
            );
        });

        return {
            promise: wrappedPromise,
            cancel() {
                hasCanceled_ = true;
            },
        };
    };
}