//import * as selectorMatchers from 'jest-enzyme-selector-matchers';
import * as emotion from 'emotion';
import { createSerializer } from 'jest-emotion';
import Adaptor from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
configure({ adapter: new Adaptor() });
expect.addSnapshotSerializer(createSerializer(emotion));
//expect.extend(selectorMatchers);u