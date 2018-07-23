using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{
    public class VengabusController : ApiController
    {
        static string SASFieldName = "Auth-SAS";

        protected TokenProvider getSASToken()
        {
            try
            {
                return TokenProvider.CreateSharedAccessSignatureTokenProvider(Request.Headers.GetValues(SASFieldName).FirstOrDefault());
            }
            catch
            {
                throw new Exception("Invalid SAS string");
            }
        }
        
    }
}