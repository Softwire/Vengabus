using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Helpers;
using VengabusAPI.Models;
using VengabusAPI.Services;

namespace VengabusAPI.Controllers
{
    public class VengabusController : ApiController
    {
        public static string SASFieldName = "Auth-SAS";

        protected string GetSASHeader()
        {
            IEnumerable<string> SASFieldList;
            try
            {
                SASFieldList = Request.Headers.GetValues(SASFieldName);
            }
            catch
            {
                throw NotFoundException($"No headers were provided at all. A {SASFieldName} header is required.");
            }

            if (!SASFieldList.Any())
            {
                throw NotFoundException($"No {SASFieldName} header was provided. It is required.");
            }

            var SASString = SASFieldList.First();
            if (String.IsNullOrWhiteSpace(SASString))
            {
                throw NotFoundException($"{SASFieldName} header was empty");
            }

            return SASString;
        }

        private HttpResponseException NotFoundException(string message)
        {
            return new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
            {
                Content = new StringContent(message)
            });
        }

        protected SASKey GetParsedSASKey()
        {
            return new SASKey(GetSASHeader());
        }

        protected TokenProvider GetSASToken()
        {
            var sasString = GetSASHeader();
            try
            {
                return TokenProvider.CreateSharedAccessSignatureTokenProvider(sasString);
            }
            catch (Exception e)
            {
                throw new Exception("SAS string is invalid", e);
            }
        }

        protected NamespaceManager CreateNamespaceManager()
        {
            var key = GetParsedSASKey();
            var token = GetSASToken();
            var address = key.ResourceName;

            var namespaceManager = new NamespaceManager(address, token);

            return namespaceManager;
        }
        protected MessagingFactory CreateEndpointFactory()
        {
            var serviceBusUri = GetParsedSASKey().ServiceBusProtocolUri;
            var sasToken = GetSASToken();
            var factory = MessagingFactory.Create(serviceBusUri, sasToken);
            return factory;
        }

        protected void DeleteMessageFromEndpoint(Endpoint endpoint)
        {
            Predicate<BrokeredMessage> deleteMessageChecker = (brokeredMessage) => true;
            MessageServices.DeleteMessagesFromEndpoint(endpoint, deleteMessageChecker);
        }

        protected void DeleteSingleMessageFromEndpoint(Endpoint endpoint, string messageId, string uniqueId)
        {
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
            MessageServices.DeleteMessagesFromEndpoint(endpoint, deleteMessageChecker);
        }
    }
}