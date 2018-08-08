import { QueueList } from "../../Components/QueueList";
import renderer from 'react-test-renderer';
import React from 'react';

describe('QueueList', () => {

    it('renders correctly with given props', () => {
        const data = [{ name: 'q1', activeMessageCount: 12, deadletterMessageCount: 14 }, { name: 'q2', activeMessageCount: 11, deadletterMessageCount: 15 }, { name: 'q3', activeMessageCount: 14, deadletterMessageCount: 16}];
        let queueList = renderer.create(
            <QueueList
                queueData={data}
            />);
        expect(queueList.toJSON()).toMatchSnapshot();
    });

});