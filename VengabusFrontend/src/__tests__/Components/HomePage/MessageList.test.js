import { MessageList } from "../../../Components/HomePage/MessageList";
import renderer from 'react-test-renderer';
import React from 'react';

describe('MessageList', () => {

    it('renders correctly with given props', () => {
        const messages = [
            {
                predefinedProperties:
                    { messageId: 10 },
                uniqueId: "2615ed49-94e0-4c27-9e44-39d1b8a28b26",
                messageBody: "<shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>"
            },
            {
                predefinedProperties:
                    { messageId: 11 },
                uniqueId: "fc6637ad-b19e-440a-b90e-ec7d277e6159",
                messageBody: "banna"
            }
        ];
        let messageList = renderer.create(
            <MessageList
                messageData={messages}
            />);
        expect(messageList.toJSON()).toMatchSnapshot();
    });

});