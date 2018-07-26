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
        [Route("messages/send/queue/{QueueName}")]
        public void SendMessageToQueue(string queueName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(queueName, messageInfoObject, EndpointType.Queue);
        }

        [HttpPost]
        [Route("messages/send/topic/{TopicName}")]
        public void SendMessageToTopic(string topicName, [FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(topicName, messageInfoObject, EndpointType.Topic);
        }

        [HttpGet]
        [Route("messages/list/queue/{queueName}")]
        //list the messages in a given queue
        public void ListMessagesInQueue(string queueName)
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("messages/list/subscription/{subscriptionName}")]
        //list the messages in a given subscription
        public void ListMessagesInSubscription(string subscriptionName)
        {
            throw new NotImplementedException();
        }

        //delete all messages in a given queue
        [HttpDelete]
        [Route("messages/queue/{queueName}")]
        public void DeleteAllMessagesInQueue(string queueName)
        {
            throw new NotImplementedException();
        }


        [HttpDelete]
        [Route("messages/subscription/{subscriptionName}")]
        //delete all messages in a given subscription
        public void DeleteAllMessagesInSubscription(string subscriptionName)
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        [Route("messages/topic/{topicName}")]
        //delete all messages in all the subscriptions for a given topic
        public void DeleteAllMessagesInTopic(string topicName)
        {
            throw new NotImplementedException();
        }

        private void SendMessageToEndpoint(string endpointName, MessageInfoPost messageInfoObject, EndpointType type)
        {
            //Sending message to queue. 
            var brokeredMessage = CreateAzureBrokeredMessage(messageInfoObject);
            var factory = CreateEndpointSenderFactory();

            SendMessageToEndpoint(factory, type, endpointName, brokeredMessage);
        }
        private static void SendMessageToEndpoint(MessagingFactory clientFactory, EndpointType type, string endpointName, BrokeredMessage message)
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