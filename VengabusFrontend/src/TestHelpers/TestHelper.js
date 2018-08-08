import { Button } from "react-bootstrap";

class TestHelper {
    /*
     * It returns a promise that waits until the state of the components is updated and then continues.
     * 
     * Expected usage is: 
     *     return testHelper.afterReactHasUpdated().then(() => {
     *         expect('actualValue').toEqual('expectedValue');
     *     });
     * 
     * Notes on multi-layered async tests (e.g. wait for this, and then wait for that, and then expect a result) will be forthcoming.
     */
    afterReactHasUpdated(noArgsGiven) {
        if (noArgsGiven) {
            throw new Error('afterReactHasUpdated() does not expect to take any arguments. See expected usage for further details.');
        }

        return new Promise(function (resolve) {
            setTimeout(resolve, 0);
        });
    }
    clickElementWithId(wrapper, id) {
        wrapper.find(id).at(0).simulate("click");
    }
}

export const testHelper = new TestHelper();
