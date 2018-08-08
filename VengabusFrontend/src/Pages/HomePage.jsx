import React, { Component } from 'react';

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            retrievedData: undefined,
            messageData: [
                { messageId: "mal formatted xml 1", messageBody: "<a><shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { messageId: "perfect XML", messageBody: "<a><b>sdfds</b><c>sdgsdg</c></a>" },
                { messageId: "mal formatted xml 2", messageBody: "<a>{s}<hipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { messageId: "Error causing xml", messageBody: "<ashipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder></a>", type: "XML" },
                { messageId: "Error causing xml 2", messageBody: "<shipto><name>Ola Nordmann</name><address>Langgt 23</address><city>4000 Stavanger</city><country>Norway</country></shipto><shiporder><item><title>Empire Burlesque</title><note>Special Edition</note><quantity>1</quantity><price>10.90</price></item><item><title>Hide your heart</title><quantity>1</quantity><price>9.90</price></item></shiporder>", type: "XML" },
                { messageId: "good json", messageBody: `{"result":true , "count":42}` },
                { messageId: "bracket json", messageBody: `[true , 42]` }
            ]
        };
    }

    updateRetrievedData = (data) => {
        this.setState({ retrievedData: data });
    };


    render() {
        return (
            < div >
                <p>Nothing here at the moment</p>
            </div >
        );
    }
}
