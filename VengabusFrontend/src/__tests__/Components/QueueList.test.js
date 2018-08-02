import { QueueList } from "../../Components/QueueList";
import renderer from 'react-test-renderer';
import React from 'react';

describe('QueueList', () => {

    it('renders correctly with given props', () => {
        const data = [{ number: 1, name: 'q1', status: 'active' }, { number: 2, name: 'q2', status: 'active' }, { number: 3, name: 'q3', status: 'dead' }];
        let queueList = renderer.create(
            <QueueList
                queueData={data}
            />);
        expect(queueList.toJSON()).toMatchSnapshot();
    });

});