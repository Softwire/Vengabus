import { MessageList } from "../../Components/MessageList";
import renderer from 'react-test-renderer';
import React from 'react';
import Adaptor from 'enzyme-adapter-react-16';
import { mount, configure } from 'enzyme';
configure({ adapter: new Adaptor() });

describe('MessageList', () => {

    it('renders correctly with given props', () => {
        const data = [{ messageId: 10, messageBody: "<shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>" }, { messageId: 11, messageBody: "banna" }]
        let messageList = renderer.create(
            <MessageList
                messageData={data}
            />);
        expect(messageList.toJSON()).toMatchSnapshot();
    });

});