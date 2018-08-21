using System;
using System.Collections.Generic;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Services
{
    public abstract class Endpoint
    {
        protected Endpoint(NamespaceManager namespaceManager, string name)
        {
            NamespaceManager = namespaceManager;
            Name = name;
        }
        public string Name { get; set; }
        protected NamespaceManager NamespaceManager;
        public abstract long GetNumberOfMessages();
        public abstract BrokeredMessage ReceiveNextBrokeredMessage(long timeout);
        public abstract void SendMessage(BrokeredMessage brokeredMessage);
        public abstract IEnumerable<BrokeredMessage> PeekNextBatch(long peekStartingPoint, int number);
    }

    public class QueueEndpoint : Endpoint
    {
        protected QueueClient Client;
        public QueueEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string name) : base(namespaceManager, name)
        {
            Client = clientFactory.CreateQueueClient(name);
        }
        public override long GetNumberOfMessages()
        {
            return NamespaceManager.GetQueue(Name).MessageCountDetails.ActiveMessageCount;
        }

        public override BrokeredMessage ReceiveNextBrokeredMessage(long timeout)
        {
            return Client.Receive(TimeSpan.FromMilliseconds(timeout));
        }

        public override void SendMessage(BrokeredMessage brokeredMessage)
        {
            Client.Send(brokeredMessage);
        }

        public override IEnumerable<BrokeredMessage> PeekNextBatch(long peekStartingPoint, int number)
        {
            return Client.PeekBatch(peekStartingPoint, number);
        }
    }

    public class QueueDeadLetterEndpoint : QueueEndpoint
    {
        public QueueDeadLetterEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string name) : base(namespaceManager, clientFactory, name)
        {
            Client = clientFactory.CreateQueueClient(name + "/$DeadLetterQueue");
        }
        public override long GetNumberOfMessages()
        {
            return NamespaceManager.GetQueue(Name).MessageCountDetails.DeadLetterMessageCount;
        }

        public override void SendMessage(BrokeredMessage brokeredMessage)
        {
            throw new NotImplementedException();
        }
    }

    public class TopicEndpoint : Endpoint
    {
        private readonly TopicClient _client;
        public TopicEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string name) : base(namespaceManager, name)
        {
            _client = clientFactory.CreateTopicClient(name);
        }
        public override long GetNumberOfMessages()
        {
            throw new NotSupportedException();
        }

        public override BrokeredMessage ReceiveNextBrokeredMessage(long timeout)
        {
            throw new NotSupportedException();
        }

        public override void SendMessage(BrokeredMessage brokeredMessage)
        {
            _client.Send(brokeredMessage);
        }

        public override IEnumerable<BrokeredMessage> PeekNextBatch(long peekStartingPoint, int number)
        {
            throw new NotSupportedException();
        }
    }

    public class SubscriptionEndpoint : Endpoint
    {
        public string ParentTopic { get; set; }
        protected SubscriptionClient Client;
        public SubscriptionEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string name, string parentTopic) : base(namespaceManager, name)
        {
            ParentTopic = parentTopic;
            Client = clientFactory.CreateSubscriptionClient(parentTopic, name);
        }
        public override long GetNumberOfMessages()
        {
            return NamespaceManager.GetSubscription(ParentTopic, Name).MessageCountDetails.ActiveMessageCount;
        }

        public override BrokeredMessage ReceiveNextBrokeredMessage(long timeout)
        {
            return Client.Receive(TimeSpan.FromMilliseconds(timeout));
        }

        public override void SendMessage(BrokeredMessage brokeredMessage)
        {
            throw new NotSupportedException();
        }

        public override IEnumerable<BrokeredMessage> PeekNextBatch(long peekStartingPoint, int number)
        {
            return Client.PeekBatch(peekStartingPoint, number);
        }
    }

    public class SubscriptionDeadLetterEndpoint : SubscriptionEndpoint
    {
        public SubscriptionDeadLetterEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string name, string parentTopic) : base(namespaceManager, clientFactory, name, parentTopic)
        {
            Client = clientFactory.CreateSubscriptionClient(parentTopic, name + "/$DeadLetterQueue");
        }
        public override long GetNumberOfMessages()
        {
            return NamespaceManager.GetSubscription(ParentTopic, Name).MessageCountDetails.DeadLetterMessageCount;
        }
    }

}