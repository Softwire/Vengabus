export const PAGES = Object.freeze({
    HomePage: 'Home',
    DemoPage: 'DemoPage',
    SendMessagePage: 'SendMessage'
});

class PageSwitcher {
    constructor() {
        this.switchCallbacks = [];
        this.currentPage = PAGES.HomePage;
        this.data = undefined;
    }

    registerForSwitchUpdates(callback) {
        this.switchCallbacks.push(callback);
    }

    registerForOnlyTheNextSwitchUpdate(originalCallback) {
        let callbackWithDeregister;
        callbackWithDeregister = (page, data) => {
            originalCallback(page, data);
            this.deregisterForSwitchUpdates(callbackWithDeregister);
        };
        this.registerForSwitchUpdates(callbackWithDeregister);
    }

    deregisterForSwitchUpdates(callback) {
        this.switchCallbacks = this.switchCallbacks.filter((cb) => cb !== callback);
    }

    switchToPage(page, data) {
        this.currentPage = page || PAGES.HomePage;
        this.data = data;
        this.switchCallbacks.forEach((registeredCallback) => {
            registeredCallback(this.currentPage, data);
        });
    }
}
export const pageSwitcher = new PageSwitcher();
