import { SubscriptionList } from '../../Components/SubscriptionList';
import renderer from 'react-test-renderer';
import React from 'react';

describe('Subscription List', () => {

    it('renders correctly with given props', () => {
        const data = [{ name: 's1', activeMessageCount: 12, deadletterMessageCount: 14 },
        { name: 's2', activeMessageCount: 11, deadletterMessageCount: 15 },
        { name: 's3', activeMessageCount: 14, deadletterMessageCount: 16 }];

        let subscriptionList = renderer.create(
            <SubscriptionList
                subscriptionData={data}
            />);
        expect(subscriptionList.toJSON()).toMatchSnapshot();
    });

});