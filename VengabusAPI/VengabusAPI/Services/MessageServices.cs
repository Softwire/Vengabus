using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;
using VengabusAPI.Controllers;
using VengabusAPI.Helpers;

namespace VengabusAPI.Services
{
    
    public class MessageServices
    {
        public static IEnumerable<BrokeredMessage> GetMessagesFromEndpoint(Endpoint endpoint)
        {
            var messagesToReturn = new List<BrokeredMessage>();

            /*
             * The problem here is that, QueueClient.Peekbatch(number) does not guarantee to return the specified number
             * of messages. Instead, the given number is just an upper bound. We have to record the Sequence Number
             * of the last received message from the previous call of Peekbatch(), and call it again starting from 
             * the previous Sequence Message + 1 in order to read new messages, until there are no messages left.
             * */
            //use -1 instead of 0, in case there's a message with sequence number 0
            long lastSequenceNumber = -1;

            //we are not realistically getting that many matches in one PeekBatch anyway -- this should be enough for this project
            int maxMessagesInPeekBatch = 100;

            while (true)
            {
                //one after the last message we've looked at
                var messages = endpoint.PeekNextBatch(lastSequenceNumber + 1, maxMessagesInPeekBatch).ToList();
                if (!messages.Any())
                {
                    break;
                }

                foreach (var message in messages)
                {
                    messagesToReturn.Add(message);
                    lastSequenceNumber = message.SequenceNumber;
                }
            }
            
            return messagesToReturn.OrderBy(item => item.EnqueuedTimeUtc);
        }

        public static void SendMessageToEndpoint(Endpoint endpoint, BrokeredMessage message)
        {
            endpoint.SendMessage(message);
        }

        public static void DeleteMessagesFromEndpoint(Endpoint endpoint, Predicate<BrokeredMessage> shouldDeleteThisMessage)
        {

            long remainingMessagesToDelete = 0;
            long defaultTimeout = 200;
            remainingMessagesToDelete = endpoint.GetNumberOfMessages();

            Func<BrokeredMessage> getNextMessageWithRetries = () => {
                long multiplier = 1;
                while (multiplier * defaultTimeout <= 60 * 1000)
                {
                    BrokeredMessage message = endpoint.ReceiveNextBrokeredMessage(defaultTimeout * multiplier);
                    if (message != null || endpoint.GetNumberOfMessages() == 0)
                    {
                        return message;
                    }
                    multiplier *= 2;
                }

                throw new TimeoutException(
                    "Messages are still present in endpoint, but it's taking too long to fetch them. Process aborted."
                );
            };

            //a rigorous way to make sure that we only delete the messages that shall be deleted, and we don't hang forever
            DateTime dateTimeCutoff = DateTime.Now;
            while (remainingMessagesToDelete > 0)
            {
                BrokeredMessage message = getNextMessageWithRetries();
                if (message == null || message.EnqueuedTimeUtc > dateTimeCutoff)
                {
                    break;
                }

                if (shouldDeleteThisMessage(message))
                {
                    message.Complete();
                }
                else
                {
                    message.Abandon();
                }
                
                remainingMessagesToDelete--;
            }
        }
    }
}
 