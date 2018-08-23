using System;
using System.Collections.Generic;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Helpers;
using VengabusAPI.Models;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{
    public class MessagesController : VengabusController
    {

        protected void PurgeMessagesFromEndpoint(Endpoint endpoint)
        {
            Predicate<BrokeredMessage> deleteMessageChecker = (brokeredMessage) => true;
            MessageServices.DeleteSelectedMessagesFromEndpoint(endpoint, deleteMessageChecker);
        }

        protected void DeleteSingleMessageFromEndpoint(Endpoint endpoint, string messageId, string uniqueId)
        {
            if (!endpoint.SupportsSingleMessageDeletion())
            {
                throw new NotSupportedException(
                    "Deleting single live message is no longer supported by the backend API." +
                    "By design, Service Bus doesn't allow deleting a single message, so in order" +
                    " to achive that, we receive messages until we get the one we want to delete." +
                    "The message will be then Complete, while the others Abandon. This is a problem" +
                    " because there is a queue/subscription behaviour that sends the message" +
                    " to the deadletters if the Delivery Count reaches Max Delivery Count."
                    );
            }

            Predicate<BrokeredMessage> deleteMessageChecker = (brokeredMessage) =>
            {
                if (messageId == brokeredMessage.MessageId)
                {
                    BodyAndHash bodyAndHash = brokeredMessage.GetBodyAndHash();

                    return bodyAndHash.Hash.ToString() == uniqueId;
                }
                else
                {
                    return false;
                }
            };
            MessageServices.DeleteSelectedMessagesFromEndpoint(endpoint, deleteMessageChecker);
        }

        protected IEnumerable<VengaMessage> GetMessagesFromEndpoint(Endpoint endpoint, int messageCount)
        {
            var brokeredMessagesList = MessageServices.GetMessagesFromEndpoint(endpoint, messageCount);
            var messagesToReturn = new List<VengaMessage>();
            foreach (var message in brokeredMessagesList)
            {
                messagesToReturn.Add(VengaMessage.FromBrokeredMessage(message));
            }
            return messagesToReturn;
        }

        protected void SendMessageToEndpoint(Endpoint endpoint, VengaMessage message)
        {
            var brokeredMessage = message.ToBrokeredMessage();
            MessageServices.SendMessageToEndpoint(endpoint, brokeredMessage);
        }
    }
}