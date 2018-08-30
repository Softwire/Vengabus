using System;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Tests
{
    public static class TestHelper
    {
        //Having to put a new SAS string here when we test is not the best way,
        //but we don't want the connection string in our code. So when running backend tests, we need to
        //generate a new SAS key from the SAS generator and put it here.
        public const string sasString = "SharedAccessSignature sr=https%3A%2F%2Fvengabusdemo.servicebus.windows.net%2F&sig=Apn1N6tmZIfGrOTpx5vnHu9YvB%2B57pA7SX8KCZ0Ez8M%3D&se=1535645668&skn=RootManageSharedAccessKey";
        public static bool sasLastUpdatedToday => (new DateTime(2018,8,30) == DateTime.Today);

        public const string ServiceBusURI = "sb://vengabusdemo.servicebus.windows.net/";

        public const string TestQueueName = "backendtestqueue";
        public const string TestTopicName = "backendtesttopic";
        public const string TestSubscriptionName = "backendtestsubscription";

        public static void SendDeadLetterMessagesToQueue(int messageCount, string queueName = TestQueueName)
        {
            var factory = CreateEndpointFactory();
            var queueClient = factory.CreateQueueClient(queueName);
            Random rnd = new Random();
            var guid = rnd.Next(12345678).ToString();
            for (int i = 0; i < messageCount; i++)
            {
                var brokeredMessage = new BrokeredMessage("This is a test message ");
                brokeredMessage.MessageId = guid;
                queueClient.Send(brokeredMessage);
            }

            for (int i = 0; i < messageCount; i++)
            {
                var message = queueClient.Receive();
                if (message.MessageId != guid)
                {
                    throw new Exception("Error: deadlettering ")
                }
                message.DeadLetter();
            }
        }

        public static void SendDeadLetterMessagesToSubscription(int messageCount, string topicName = TestTopicName, string subscriptionName = TestSubscriptionName)
        {
            var factory = CreateEndpointFactory();
            var topicClient = factory.CreateTopicClient(topicName);
            var subscriptionClient = factory.CreateSubscriptionClient(topicName, subscriptionName);

            string msg = "This is a test message";
            for (int i = 0; i < messageCount; i++)
            {
                topicClient.Send(new BrokeredMessage(msg));
            }

            for (int i = 0; i < messageCount; i++)
            {
                var message = subscriptionClient.Receive();
                message.DeadLetter();
            }
        }

        public static void SendMessagesToQueue(int messageCount, string queueName = TestQueueName)
        {
            var factory = CreateEndpointFactory();
            var queueClient = factory.CreateQueueClient(queueName);

            string msg = "This is a test message";
            Random rnd = new Random();
            for (int i = 0; i < messageCount; i++)
            {
                var brokeredMessage = new BrokeredMessage(msg);
                brokeredMessage.MessageId = rnd.Next(10000000).ToString();
                queueClient.Send(brokeredMessage);
            }
        }

        public static void SendMessagesToTopic(int messageCount, string topicName = TestTopicName)
        {
            var factory = CreateEndpointFactory();
            var topicClient = factory.CreateTopicClient(topicName);

            string msg = "This is a test message";
            for (int i = 0; i < messageCount; i++)
            {
                topicClient.Send(new BrokeredMessage(msg));
            }
        }

        public static MessageCountDetails getMessageCountInQueue(string queueName = TestQueueName)
        {
            var namespaceManager = GetNamespaceManager();
            var queueDescription = namespaceManager.GetQueue(queueName);
            return queueDescription.MessageCountDetails;
        }

        public static MessageCountDetails getMessageCountInSubscription(string topicName = TestTopicName, string subscriptionName = TestSubscriptionName)
        {
            var namespaceManager = GetNamespaceManager();
            var subscriptionDescription = namespaceManager.GetSubscription(topicName, subscriptionName);
            return subscriptionDescription.MessageCountDetails;
        }

        public static long DeleteAllMessagesFromQueue(string queueName = TestQueueName)
        {
            var factory = CreateEndpointFactory();
            var queueClient = factory.CreateQueueClient(queueName);
            long deletionCount = 0;
            while (true)
            {
                var messages = queueClient.Receive(TimeSpan.FromMilliseconds(5000));
                if (messages == null)
                {
                    break;
                }
                messages.Complete();
                deletionCount++;
            }

            var messageCount = getMessageCountInQueue(queueName);
            if (messageCount.ActiveMessageCount != 0)
            {
                throw new Exception(
                    "Testhelped failed to delete all messages in queue, there are still messages remaining.");
            }
            return deletionCount;
        }

        private static NamespaceManager GetNamespaceManager()
        {
            var address = ServiceBusURI;
            var token = TokenProvider.CreateSharedAccessSignatureTokenProvider(sasString);

            var namespaceManager = new NamespaceManager(address, token);

            return namespaceManager;
        }

        public static MessagingFactory CreateEndpointFactory()
        {
            var factory = MessagingFactory.Create(ServiceBusURI, TokenProvider.CreateSharedAccessSignatureTokenProvider(sasString));
            return factory;
        }
    }
}
