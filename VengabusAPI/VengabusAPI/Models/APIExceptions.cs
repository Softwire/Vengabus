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
        public bool isManagedException = true;
    }

    class APIError : APIExceptions
    {
        public APIError(string message) : base(message){}
        public bool isError = true;
    }

    class APIWarning : APIExceptions
    {
        public APIWarning(string message) : base(message) { }
        public bool isWarning = true;
    }

    class APIInfo : APIExceptions
    {
        public APIInfo(string message) : base(message) { }
        public bool isInfo = true;
    }
}
