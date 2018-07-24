using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Linq;


namespace VengabusAPI.Models
{

    public class SASKey
    {
        public string ResourceName { get; set; }
        public string Signature { get; set; }
        public string Expiry { get; set; }
        public string KeyName { get; set; }

        private const string SASKeyPattern = "SharedAccessSignature sr=([^&]*)&sig=([^&]*)&se=([^&]*)&skn=([^&]*)";

        public SASKey(string SASKeyString)
        {
            MatchCollection matches = Regex.Matches(SASKeyString, SASKeyPattern);

            if (matches.Count != 1)
            {
                throw new CustomAttributeFormatException(
                    $"SASKey is badly formatted! Expected string to match: '{SASKeyPattern}'; Actually received: '{SASKeyString}'."
                    );
            }

            this.ResourceName = GetAndDecodeGroupN(matches, 1);
            this.Signature = GetAndDecodeGroupN(matches, 2);
            this.Expiry = GetAndDecodeGroupN(matches, 3);
            this.KeyName = GetAndDecodeGroupN(matches, 4);
        }

        private string GetAndDecodeGroupN(MatchCollection matches, int n)
        {
            return HttpUtility.UrlDecode(matches[0].Groups[n].Value);
        }
    }
}