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
            var anyDeletions = MessageServices.DeleteSelectedMessagesFromEndpoint(endpoint, deleteMessageChecker);

            throw new APIWarning("No messages were deleted. The endpoint may have been empty, or the messages may have already been consumed by another process.");
        }

        protected void DeleteSingleMessageFromEndpoint(Endpoint endpoint, string messageId, string uniqueId)
        {
            if (!endpoint.SupportsSingleMessageDeletion())
            {
                throw new NotSupportedException(
@"Deleting single live message is no longer supported by the backend API.
By design, Service Bus doesn't allow targetted deletion of a single message, 
so in order to achive that, we Receive() messages until we get the one we 
want to delete. We then Complete() the message we want to delete, and 
Abandon() all the others. This is a problem because there is a queue/subscription 
behaviour that sends the message to the deadletters if it is repeatedly Received 
and Abandoned enough times, (limit determined by 'Max Delivery Count' property)"
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

            throw new APIError(@"No messages were deleted. The intended messages may have already been consumed by another process.

Please reload the message list and try again.");

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