import { TopicList } from "../../../Components/HomePage/TopicList";
import renderer from 'react-test-renderer';
import React from 'react';

describe('TopicList', () => {

    it('renders correctly with given props', () => {
        const topics = [
            { name: "topic 1", subscriptionCount: "10", topicStatus: "okay" },
            { name: "topic 2", subscriptionCount: "12", topicStatus: "okay" }
        ];
        let topicsList = renderer.create(
            <TopicList
                topicData={topics}
            />);
        expect(topicsList.toJSON()).toMatchSnapshot();
    });

});