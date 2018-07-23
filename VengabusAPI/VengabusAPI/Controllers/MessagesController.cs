using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{
    public class MessageInfoPost
    {
        public Dictionary<string, object> MessageProperties { get; set; }
        public string SAS { get; set; }
        public string MessageBody { get; set; }
        public string MessageId { get; set; }
        public string ContentType { get; set; }
        public string QueueName { get; set; }
    }


    public class SendMessagesController : ApiController
    {

        [HttpPost]
        [Route("messages/send/queue")]
        public void SendMessageToQueue([FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(messageInfoObject, EndpointType.Queue);
        }

        [HttpPost]
        [Route("messages/send/topic")]
        public void SendMessageToTopic([FromBody]MessageInfoPost messageInfoObject)
        {
            SendMessageToEndpoint(messageInfoObject, EndpointType.Topic);
        }

        [HttpGet]
        [Route("messages/list/queue/{queueName}")]
        //list the messages in a given queue
        public void ListMessagesInQueue()
        {
            throw new NotImplementedException();
        }

        [HttpGet]
        [Route("messages/list/subscription/{subscriptionName}")]
        //list the messages in a given subscription
        public void ListMessagesInSubscription()
        {
            throw new NotImplementedException();
        }

        [Route("messages/viewMessage")]
        //view the contents of a given message
        public void ViewMessage()
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Route("messages/delete/queue/{queueName}")]
        //delete all messages in a given queue
        public void DeleteAllMessagesInQueue()
        {
            throw new NotImplementedException();
        }


        [HttpPost]
        [Route("messages/delete/subscription/{subscriptionName}")]
        //delete all messages in a given subscription
        public void DeleteAllMessagesInSubscription()
        {
            throw new NotImplementedException();
        }



        private static MessagingFactory CreateEndpointSenderFactory(string sas)
        {
            Uri runtimeUri = ServiceBusEnvironment.CreateServiceUri("sb", "VengabusDemo", string.Empty);
            var sasToken = TokenProvider.CreateSharedAccessSignatureTokenProvider(sas);
            var factory = MessagingFactory.Create(runtimeUri, sasToken);
            return factory;
        }
        private void SendMessageToEndpoint(MessageInfoPost messageInfoObject, EndpointType type)
        {
            //Sending message to queue. 
            var brokeredMessage = CreateAzureBrokeredMessage(messageInfoObject);
            var factory = CreateEndpointSenderFactory(messageInfoObject.SAS);

            SendMessageToEndpoint(factory, type, messageInfoObject.QueueName, brokeredMessage);
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