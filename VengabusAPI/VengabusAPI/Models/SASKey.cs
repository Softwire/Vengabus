using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;


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
            
            this.ResourceName = HttpUtility.UrlDecode(matches[0].Groups[1].Value); 
            this.Signature = HttpUtility.UrlDecode(matches[0].Groups[2].Value);
            this.Expiry = HttpUtility.UrlDecode(matches[0].Groups[3].Value);
            this.KeyName = HttpUtility.UrlDecode(matches[0].Groups[4].Value);
        }
    }
}