using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{
    public class MessageInfoPost
    {
        public Dictionary<string, object> MessageProperties { get; set; }
        public string MessageBody { get; set; }
        public string MessageId { get; set; }
        public string ContentType { get; set; }
    }


    public class MessagesController : VengabusController
    {

        [HttpPost]
        [Route("messages/send/queue/{queueName}")]
        public void SendMessageToQueue(string queueName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(queueName, EndpointType.Queue, messageInfoObject);
        }

        [HttpPost]
        [Route("messages/send/topic/{topicName}")]
        public void SendMessageToTopic(string topicName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(topicName, EndpointType.Topic, messageInfoObject);
        }

        [HttpPost]
        [Route("messages/send/subscription/{topicName}/{subscriptionName}")]
        public void SendMessageToSubscription(string topicName, string subscriptionName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(subscriptionName, EndpointType.Topic, messageInfoObject, topicName);
        }

        [HttpGet]
        [Route("messages/list/queue/{queueName}")]
        //list the messages in a given queue
        public void ListMessagesInQueue(string queueName)
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("messages/list/subscription/{topicName}/{subscriptionName}")]
        //list the messages in a given subscription
        public void ListMessagesInSubscription(string topicName, string subscriptionName)
        {
            throw new NotImplementedException();
        }

        //delete all messages in a given queue
        [HttpDelete]
        [Route("messages/queue/{queueName}")]
        public void DeleteAllMessagesInQueue(string queueName)
        {
            DeleteMessageFromEndpoint(EndpointIdentifier.ForQueue(queueName));
        }


        [HttpDelete]
        [Route("messages/subscription/{topicName}/{subscriptionName}")]
        //delete all messages in a given subscription
        public void DeleteAllMessagesInSubscription(string topicName, string subscriptionName)
        {
            DeleteMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionName));
        }

        [HttpDelete]
        [Route("messages/topic/{topicName}")]
        //delete all messages in all the subscriptions for a given topic
        public void DeleteAllMessagesInTopic(string topicName)
        {
            //get all subscriptions, and delete for each of them.
            var namespaceManager = CreateNamespaceManager();
            var topicDescription = namespaceManager.GetSubscriptions(topicName);
            foreach (var subscriptionDescription in topicDescription)
            {
                DeleteMessageFromEndpoint(EndpointIdentifier.ForSubscription(topicName, subscriptionDescription.Name));
            }
        }

        private void DeleteMessageFromEndpoint(EndpointIdentifier endpoint)
        {
            var factory = CreateEndpointSenderFactory();
            DeleteMessageFromEndpoint(factory, endpoint);
        }
        private void DeleteMessageFromEndpoint(MessagingFactory clientFactory, EndpointIdentifier endpoint)
        {
            switch (endpoint.Type)
            {
                case EndpointType.Queue:
                    QueueClient queueClient = clientFactory.CreateQueueClient(endpoint.Name);
                    //receive all the messages and complete each of them.
                    while (true)
                    {
                        var message = queueClient.Receive(TimeSpan.FromMilliseconds(5000));
                        if (message == null)
                        {
                            break;
                        }
                        message.Complete();
                    }
                    return;

                case EndpointType.Subscription:
                    SubscriptionClient subscriptionClient = clientFactory.CreateSubscriptionClient(endpoint.ParentTopic, endpoint.Name);
                    //receive all the messages and complete each of them.
                    while (true)
                    {
                        var message = subscriptionClient.Receive(TimeSpan.FromMilliseconds(500));
                        if (message == null)
                        {
                            break;
                        }
                        message.Complete();
                    }
                    return;
            }
        }
        private void SendMessageToEndpoint(string endpointName, EndpointType type, MessageInfoPost messageInfoObject, string parentTopicName = "")
        {
            //Sending message to queue. 
            var brokeredMessage = CreateAzureBrokeredMessage(messageInfoObject);
            var factory = CreateEndpointSenderFactory();

            SendMessageToEndpoint(endpointName, type, factory, brokeredMessage, parentTopicName);
        }
        private void SendMessageToEndpoint(string endpointName, EndpointType type, MessagingFactory clientFactory, BrokeredMessage message, string parentTopicName = "")
        {
            switch (type)
            {
                case EndpointType.Queue:
                    QueueClient queueClient = clientFactory.CreateQueueClient(endpointName);
                    queueClient.Send(message);
                    return;

                case EndpointType.Topic:
                    TopicClient topicClient = clientFactory.CreateTopicClient(endpointName);
                    topicClient.Send(message);
                    return;

                case EndpointType.Subscription:
                    throw new NotImplementedException();
            }
        }
        private BrokeredMessage CreateAzureBrokeredMessage(MessageInfoPost messageInfoObject)
        {
            var message = new BrokeredMessage(messageInfoObject.MessageBody);
            message.MessageId = messageInfoObject.MessageId;
            message.ContentType = messageInfoObject.ContentType;

            foreach (var property in messageInfoObject.MessageProperties)
            {
                message.Properties.Add(property.Key, property.Value);
            }

            return message;
        }

    }
}