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
                throw new NotSupportedException();
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