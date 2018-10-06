using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace VengabusAPI.Tests
{
    public class DeleteSingleMessage
    {
        [TestMethod, Description("Delete All messages from a queue, one by one, and the process should not send messages to deadletter")]
        public void DeleteSingleMessageFromBusyQueue()
        {
            
        }
    }
}
