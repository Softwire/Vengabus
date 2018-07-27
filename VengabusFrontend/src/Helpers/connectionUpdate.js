class ConnectionUpdate {
    constructor() {
        this.updateCallBacks = [];
    }

    registerForUpdates(callback) {
        this.updateCallBacks.push(callback);
    }

    deregisterForUpdates(callback) {
        this.updateCallBacks = this.switchCallbacks.filter((cb) => cb !== callback);
    }

    performUpdate() {
        this.updateCallBacks.forEach((registeredCallback) => {
            registeredCallback();
        });
    }
}
export const connectionUpdate = new ConnectionUpdate();
