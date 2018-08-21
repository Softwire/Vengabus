export class cancelablePromiseCollection {
    constructor() {
        this.collection = [];
    }


    newPromise = (promise) => {
        this.collection.add(this.makeCancelable(promise));
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
            this.cancelPromise(promise)
        );
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