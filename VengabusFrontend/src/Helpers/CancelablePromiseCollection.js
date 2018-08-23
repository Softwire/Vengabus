export class cancelablePromiseCollection {
    constructor() {
        this.trackedPromises = [];
    }


    addNewPromise = (originalPromise,endpointType) => {
        const prom = this.makeCancellable(originalPromise);
        prom.type = endpointType;
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

    cancelAllPromises = (endpointType) => {
        if(!endpointType){
            this.trackedPromises.forEach(promise => { promise.cancel();});
            this.trackedPromises = [];
        } else {
            //remove all of type
            const trackedPromisesClone = [...this.trackedPromises];
            trackedPromisesClone.forEach(promise => {
                if (promise.type === endpointType) {
                    this.cancelPromise(promise);
                }
            });
        }
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