using System;
using System.Linq;
using System.Web.Http;
using Microsoft.ServiceBus;

namespace VengabusAPI.Controllers
{
    public class VengabusController : ApiController
    {
        public static string SASFieldName = "Auth-SAS";

        protected string GetSASHeader()
        {
            var SASFieldList = Request.Headers.GetValues(SASFieldName);
            if (!SASFieldList.Any())
            {
                throw new Exception($"No {SASFieldName} header was provided");
            }

            var SASString = SASFieldList.First();
            if (String.IsNullOrWhiteSpace(SASString))
            {
                throw new Exception($"{SASFieldName} header was empty");
            }

            return SASString;
        }
        protected TokenProvider GetSASToken()
        {
            var SASString = GetSASHeader();
            try
            {
                return TokenProvider.CreateSharedAccessSignatureTokenProvider(SASString);
            }
            catch (Exception e)
            {
                throw new Exception("SAS string is invalid", e);
            }
        }
        
    }
}