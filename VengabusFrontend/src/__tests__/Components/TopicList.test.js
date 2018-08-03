import { TopicList } from "../../Components/TopicList";
import renderer from 'react-test-renderer';
import React from 'react';

describe('TopicList', () => {

    it('renders correctly with given props', () => {
        const data = [{ name: "topic 1", subscriptionCount: "10", topicStatus: "okay" }, { name: "topic 2", subscriptionCount: "12", topicStatus: "okay" }]
        let topicsList = renderer.create(
            <TopicList
                topicData={data}
            />);
        expect(topicsList.toJSON()).toMatchSnapshot();
    });

});