import * as emotion from 'emotion';
import { createSerializer } from 'jest-emotion';
import Adaptor from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
configure({ adapter: new Adaptor() });
expect.addSnapshotSerializer(createSerializer(emotion));

//There is already an expect().toExist() function, but it doesn't work as intended along with wrapper.find():
//if wrapper.find() did not find any matching object, it still returns a non-empty object
//saying that there's nothing found, and therefore THAT object exists.
expect.extend({
    toExistOnPage(received) {
        return {
            message: () => 'expected ${received} to exist',
            pass: received && received.exists()
        };
    }
});