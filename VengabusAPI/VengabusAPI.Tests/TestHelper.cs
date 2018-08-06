using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Tests
{
    public static class TestHelper
    {
        public const string sasString = "SharedAccessSignature sr=https%3A%2F%2Fvengabusdemo.servicebus.windows.net%2F&sig=3e1430xZG7nq41QsZNLdPIoF4L666UHb9GUlwZ9F8t8%3D&se=1533565396&skn=RootManageSharedAccessKey";

        public const string ServiceBusURI = "sb://vengabusdemo.servicebus.windows.net/";

        public const string TestQueueName = "backendtestqueue";
        public const string TestTopicName = "backendtesttopic";
        public const string TestSubscriptionName = "backendtestsubscription";

        public static void SendDeadLetterMessagesToQueue(int messageCount, string queueName = TestQueueName)
        {
            var factory = CreateEndpointFactory();
            var queueClient = factory.CreateQueueClient(queueName);

            string msg = "This is a test message";
            for (int i = 0; i < messageCount; i++)
            {
                var brokeredMessage = new BrokeredMessage(msg);
                queueClient.Send(brokeredMessage);
            }

            for (int i = 0; i < messageCount; i++)
            {
                var message = queueClient.Receive();
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
            for (int i = 0; i < messageCount; i++)
            {
                queueClient.Send(new BrokeredMessage(msg));
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

        private static NamespaceManager GetNamespaceManager()
        {
            var address = ServiceBusURI;
            var token = TokenProvider.CreateSharedAccessSignatureTokenProvider(sasString);

            var namespaceManager = new NamespaceManager(address, token);

            return namespaceManager;
        }

        public static MessagingFactory CreateEndpointFactory()
        {
            var serviceBusUri = ServiceBusURI;
            var sasToken = sasString;
            var factory = MessagingFactory.Create(serviceBusUri, TokenProvider.CreateSharedAccessSignatureTokenProvider(sasToken));
            return factory;
        }
    }
}
