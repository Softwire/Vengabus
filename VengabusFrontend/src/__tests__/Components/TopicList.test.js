import { TopicList } from "../../Components/TopicsList";
import renderer from 'react-test-renderer';
import React from 'react';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
configure({ adapter: new Adaptor() });

describe('TopicList', () => {

    it('renders correctly with given props', () => {
        const data = [{ TopicName: "topic 1", subs: ["sub 1", "sub2", "sub3"], status: "okay" }, { TopicName: "topic 2", subs: ["sub a", "sub b"], status: "okay" }]
        let topicsList = renderer.create(
            <TopicList
                topicData={data}
            />);
        expect(topicsList.toJSON()).toMatchSnapshot();
    });

});