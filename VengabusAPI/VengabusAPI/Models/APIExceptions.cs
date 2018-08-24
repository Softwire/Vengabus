using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Models
{
    class APIExceptions : Exception
    {
        public APIExceptions(string message) : base(message) { }
    }

    class APIError : APIExceptions
    {
        public APIError(string message) : base(message){}
    }

    class APIWarning : APIExceptions
    {
        public APIWarning(string message) : base(message) { }
    }

    class APIInfo : APIExceptions
    {
        public APIInfo(string message) : base(message) { }
    }
}
