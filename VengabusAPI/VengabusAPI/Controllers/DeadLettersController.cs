using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;
using System.IO;

namespace VengabusAPI.Controllers
{

    public class DeadLettersController : VengabusController
    {
        //qq JF XR delete MessagingFactory later and put in a separate file or in VengabusController
        public MessagingFactory CreateEndpointSenderFactory()
        {
            Uri runtimeUri = ServiceBusEnvironment.CreateServiceUri("sb", "VengabusDemo", string.Empty);
            var sasToken = GetSASToken();
            var factory = MessagingFactory.Create(runtimeUri, sasToken);
            return factory;
        }


        [HttpGet]
        [Route("deadLetters/queue/{queueName}")]
        public IEnumerable<VengaMessage> GetDeadLetterMessages(string queueName)
        {
            int i = 0;
            var clientFactory = CreateEndpointSenderFactory();
            QueueClient queueClientMain = clientFactory.CreateQueueClient(queueName);
            var deadLetterQueuePath = QueueClient.FormatDeadLetterPath(queueClientMain.Path);

            var queueClient = clientFactory.CreateQueueClient(deadLetterQueuePath);
            const string address = "https://vengabusdemo.servicebus.windows.net/";
            var namespaceManager = new NamespaceManager(address, GetSASToken());
            var deadLetterMessageCount = namespaceManager.GetQueue(queueName).MessageCountDetails.DeadLetterMessageCount;

            IEnumerable<VengaMessage> messageOutputIEnum = Enumerable.Empty<VengaMessage>();

            /*
             * The problem here is that, QueueClient.Peekbatch(number) does not guarantee to return the specified number
             * of messages. Instead, the given number is just an upper bound. We have to record the Sequence Number
             * of the last received message from the previous call of Peekbatch(), and call it again starting from 
             * the previous Sequence Message + 1 in order to read new messages, until we peeked at the correct number 
             * of messages.
             * */
            long lastSequenceNumber = 0;

            var initialPeekBatch = true;

            while (i < deadLetterMessageCount)
            {
                IEnumerable<BrokeredMessage> messages;
                if (initialPeekBatch)
                {
                    initialPeekBatch = false;
                    messages = queueClient.PeekBatch((int)deadLetterMessageCount).ToList();
                }
                else
                {
                    messages = queueClient.PeekBatch(lastSequenceNumber, (int)deadLetterMessageCount - i).ToList();
                }

                foreach (var message in messages)
                {
                    i++;
                    var vengaMessage = new VengaMessage(message.Properties, message.GetBody<String>(),
                        message.MessageId, message.ContentType);
                    messageOutputIEnum = messageOutputIEnum.Concat(new[] {vengaMessage});
                    lastSequenceNumber = message.SequenceNumber + 1;
                }
            }

            return messageOutputIEnum;

        }

        [HttpGet]
        [Route("deadLetters/subscription/{subscriptionName}")]
        public void ViewSubscriptionDeadLetterMessages(string subscriptionName)
        {
            /*int i = 0;
            var clientFactory = CreateEndpointSenderFactory();

            SubscriptionClient subscriptionClientMain = clientFactory.CreateSubscriptionClient(subscriptionName);
            var deadLetterSubscriptionPath = SubscriptionClient.FormatDeadLetterPath(subscriptionClientMain.Path);

            var subscriptionClient = clientFactory.CreateSubscriptionClient(deadLetterSubscriptionPath);
            const string address = "https://vengabusdemo.servicebus.windows.net/";
            var namespaceManager = new NamespaceManager(address, GetSASToken());
            var deadLetterMessageCount = namespaceManager.GetQueue(subscriptionName).MessageCountDetails.DeadLetterMessageCount;
            */
            IEnumerable<VengaMessage> messageOutputIEnum = Enumerable.Empty<VengaMessage>();


            /*
             * The problem here is that, QueueClient.Peekbatch(number) does not guarantee to return the specified number
             * of messages. Instead, the given number is just an upper bound. We have to record the Sequence Number
             * of the last received message from the previous call of Peekbatch(), and call it again starting from 
             * the previous Sequence Message + 1 in order to read new messages, until we peeked at the correct number 
             * of messages.
             * */

            /*
            long lastSequenceNumber = 0;

            var initialPeekBatch = true;

            while (i < deadLetterMessageCount)
            {
                IEnumerable<BrokeredMessage> messages;
                if (initialPeekBatch)
                {
                    initialPeekBatch = false;
                    messages = queueClient.PeekBatch((int)deadLetterMessageCount).ToList();
                }
                else
                {
                    messages = queueClient.PeekBatch(lastSequenceNumber, (int)deadLetterMessageCount - i).ToList();
                }

                foreach (var message in messages)
                {
                    i++;
                    var vengaMessage = new VengaMessage(message.Properties, message.GetBody<String>(),
                        message.MessageId, message.ContentType);
                    messageOutputIEnum = messageOutputIEnum.Concat(new[] { vengaMessage });
                    lastSequenceNumber = message.SequenceNumber + 1;
                }
            }
            */
            return messageOutputIEnum;
        }

    }
}

