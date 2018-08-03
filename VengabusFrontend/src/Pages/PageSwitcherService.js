export const PAGES = Object.freeze({
    HomePage: 'Home',
    DemoPage: 'DemoPage',
    SendMessagePage: 'SendMessage',
    EditQueuesPage: 'EditQueues'
});

class PageSwitcher {
    constructor() {
        this.switchCallbacks = [];
        this.currentPage = PAGES.HomePage;
        this.pageData = undefined;
    }

    registerForSwitchUpdates(callback) {
        this.switchCallbacks.push(callback);
    }

    registerForOnlyTheNextSwitchUpdate(originalCallback) {
        let callbackWithDeregister;
        callbackWithDeregister = (page, pageData) => {
            originalCallback(page, pageData);
            this.deregisterForSwitchUpdates(callbackWithDeregister);
        };
        this.registerForSwitchUpdates(callbackWithDeregister);
    }

    deregisterForSwitchUpdates(callback) {
        this.switchCallbacks = this.switchCallbacks.filter((cb) => cb !== callback);
    }

    switchToPage(page, pageData) {
        this.currentPage = page || PAGES.HomePage;
        this.pageData = pageData;
        this.switchCallbacks.forEach((registeredCallback) => {
            registeredCallback(this.currentPage, pageData);
        });
    }
}
export const pageSwitcher = new PageSwitcher();
