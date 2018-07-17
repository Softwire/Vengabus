class TestHelper {
    /*
     * It waits until the state of the components is updated and then calls the callback function.
     */
    afterReactHasUpdated(callback) {
        return new Promise(function (resolve) {
            setTimeout(resolve, 0);
        });
    }
}

export const testHelper = new TestHelper();
