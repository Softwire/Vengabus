class PromptUpdate {
    constructor() {
        this.updateCallBacks = [];
    }

    registerForUpdatesPrompts = (callback) => {
        this.updateCallBacks.push(callback);
    }

    deregisterForUpdatesPrompts = (callback) => {
        this.updateCallBacks = this.switchCallbacks.filter((cb) => cb !== callback);
    }

    promptUpdate = () => {
        this.updateCallBacks.forEach((registeredCallback) => {
            registeredCallback();
        });
    }
}
export const promptUpdate = new PromptUpdate();
