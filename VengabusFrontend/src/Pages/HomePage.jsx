import React, { Component } from 'react';

export class HomePage extends Component {

    render() {
        const queueDivStyle = css`
            width: 30%;
            margin: 10px;
            display: inline-block; /*to allow tables to be displayed side by side*/
        `;
        // Hard coded message to replay for now
        const exampleMessage = {
            MessageProperties: {
                userDefinedProp1: 'value1',
                userDefinedProp2: 'value2'
            },
            MessageBody: 'Hello world!',
            MessageId: 'Message1',
            ContentType: 'null'
        };
        const exampleReplay = {
            message: exampleMessage,
            recipientIsQueue: true,
            selectedQueue: 'demoqueue4'
        }

        //qq remove hardcoded endpoint names later
        const queueName = 'demoqueue1';
        const topicName = 'demotopic1';
        const subscriptionName = 'demosubscription1';
        const serviceBusService = serviceBusConnection.getServiceBusService();

        return (
            < div >
                <div className={queueDivStyle}>
                    <button onClick={() => pageSwitcher.switchToPage(PAGES.SendMessagePage, exampleReplay)}>Replay Example Message</button>
                    <QueueList queueData={this.state.retrievedData} />
                    <MessageList messageData={this.state.messageData} />
                    {/*qq delete the text in Button once implemented properly*/}
                    <Button onClick={() => serviceBusService.deleteQueueMessages(queueName)} bsStyle="danger">
                        Delete queue messages&#160;
                        <Glyphicon glyph="trash" />
                    </Button>
                    <Button onClick={() => serviceBusService.deleteTopicMessages(topicName)} bsStyle="danger">
                        Delete topic messages&#160;
                        <Glyphicon glyph="trash" />
                    </Button>
                    <Button onClick={() => serviceBusService.deleteSubscriptionMessages(topicName, subscriptionName)} bsStyle="danger">
                        Delete subcription messages&#160;
                        <Glyphicon glyph="trash" />
                    </Button>

                </div>
            </div >
        );
    }
}
