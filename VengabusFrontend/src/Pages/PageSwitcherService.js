export const PAGES = Object.freeze({
    HomePage: 'Home',
    OtherPage: 'Other'
});

class PageSwitcher {
    constructor() {
        this.switchCallbacks = [];
        this.currentPage = PAGES.HomePage;
    }

    registerForSwitchUpdates(callback) {
        this.switchCallbacks.push(callback);
    }

    registerForOnlyTheNextSwitchUpdate(originalCallback) {
        let callbackWithDeregister;
        callbackWithDeregister = (page) => {
            originalCallback(page);
            this.deregisterForSwitchUpdates(callbackWithDeregister);
        };
        this.registerForSwitchUpdates(callbackWithDeregister);
    }

    deregisterForSwitchUpdates(callback) {
        this.switchCallbacks = this.switchCallbacks.filter((cb) => cb !== callback);
    }

    switchToPage(page) {
        this.currentPage = page || PAGES.HomePage;
        this.switchCallbacks.forEach((registeredCallback) => {
            registeredCallback(this.currentPage);
        });
    }
}
export const pageSwitcher = new PageSwitcher();
