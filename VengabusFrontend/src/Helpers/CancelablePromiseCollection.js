export class cancelablePromiseCollection {
    constructor() {
        this.trackedPromises = [];
    }


    addNewPromise = (originalPromise) => {
        const prom = this.makeCancellable(originalPromise);
        this.trackedPromises.push(prom);
        return prom;
    }

    cancelPromise = (promise) => {
        const index = this.trackedPromises.indexOf(promise);
        if (index > 0) {
            this.trackedPromises.splice(index, 1);
        }
        promise.cancel();
    }

    cancelAllPromises = () => {
        this.trackedPromises.forEach(promise => { promise.cancel();});
        this.trackedPromises = [];
    }

    makeCancellable = (originalPromise) => {
        let hasCancelled = false;

        const wrappedPromise = new Promise((resolve, reject) => {
            originalPromise.then(
                val => hasCancelled ? reject({ isCanceled: true }) : resolve(val),
                error => hasCancelled ? reject({ isCanceled: true }) : reject(error)
            );
        });

        wrappedPromise.cancel = () => { hasCancelled = true; };
        return wrappedPromise;
    };
}