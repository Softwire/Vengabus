using System;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Linq;


namespace VengabusAPI.Models
{

    public class SASKey
    {
        private const string SASKeyPattern = "SharedAccessSignature sr=([^&]*)&sig=([^&]*)&se=([^&]*)&skn=([^&]*)";

        public string ResourceName { get; set; }
        public string Signature { get; set; }
        public string Expiry { get; set; }
        public string KeyName { get; set; }

        public Uri ServiceBusProtocolUri
        {
            get
            {
                //we don't want the port number after Uri. Use port = -1 to remove it 
                var Uri = (new UriBuilder(ResourceName) { Scheme = "sb", Port = -1 }).Uri;
                return Uri;
            }
        }

        public SASKey(string SASKeyString)
        {
            MatchCollection matches = Regex.Matches(SASKeyString, SASKeyPattern);

            if (matches.Count != 1)
            {
                throw new CustomAttributeFormatException(
                    $"SASKey is badly formatted! Expected string to match: '{SASKeyPattern}'; Actually received: '{SASKeyString}'."
                    );
            }

            ResourceName = GetAndDecodeGroupN(matches, 1);
            Signature = GetAndDecodeGroupN(matches, 2);
            Expiry = GetAndDecodeGroupN(matches, 3);
            KeyName = GetAndDecodeGroupN(matches, 4);
        }

        private string GetAndDecodeGroupN(MatchCollection matches, int n)
        {
            return HttpUtility.UrlDecode(matches[0].Groups[n].Value);
        }
    }
}