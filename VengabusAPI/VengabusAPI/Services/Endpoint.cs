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
        public abstract bool SupportsSingleMessageDeletion();
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

        public override bool SupportsSingleMessageDeletion()
        {
            return false;
        }
    }

    public class QueueDeadletterEndpoint : QueueEndpoint
    {
        public QueueDeadletterEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string name) : base(namespaceManager, clientFactory, name)
        {
            Client = clientFactory.CreateQueueClient(name + "/$DeadletterQueue");
        }
        public override long GetNumberOfMessages()
        {
            return NamespaceManager.GetQueue(Name).MessageCountDetails.DeadLetterMessageCount;
        }

        public override void SendMessage(BrokeredMessage brokeredMessage)
        {
            throw new NotImplementedException();
        }

        public override bool SupportsSingleMessageDeletion()
        {
            return true;
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

        public override bool SupportsSingleMessageDeletion()
        {
            return false;
        }
    }

    public class SubscriptionEndpoint : Endpoint
    {
        public string ParentTopic { get; set; }
        protected SubscriptionClient Client;
        public SubscriptionEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string parentTopic, string name) : base(namespaceManager, name)
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

        public override bool SupportsSingleMessageDeletion()
        {
            return false;
        }
    }

    public class SubscriptionDeadletterEndpoint : SubscriptionEndpoint
    {
        public SubscriptionDeadletterEndpoint(NamespaceManager namespaceManager, MessagingFactory clientFactory, string parentTopic, string name) : base(namespaceManager, clientFactory, parentTopic, name)
        {
            Client = clientFactory.CreateSubscriptionClient(parentTopic, name + "/$DeadletterQueue");
        }
        public override long GetNumberOfMessages()
        {
            return NamespaceManager.GetSubscription(ParentTopic, Name).MessageCountDetails.DeadLetterMessageCount;
        }

        public override bool SupportsSingleMessageDeletion()
        {
            return true;
        }
    }

}