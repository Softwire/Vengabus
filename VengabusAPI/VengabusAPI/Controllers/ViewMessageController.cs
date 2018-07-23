using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{

    public class ViewMessageController : ApiController
    {

        [Route("viewMessage")]
        //view the contents of a given message
        public void ViewMessage()
        {
            throw new NotImplementedException();
        }

    }
}