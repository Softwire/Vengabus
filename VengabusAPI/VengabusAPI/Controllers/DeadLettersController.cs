using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;
using System.IO;

namespace VengabusAPI.Controllers
{
    public class DeadLettersController : VengabusController
    {
        //this file is now obsolete, but perhaps don't delete it in case we want to add endpoints here in the future.
    }
}

