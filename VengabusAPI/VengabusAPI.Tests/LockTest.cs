using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using VengabusAPI.Controllers;
using VengabusAPI.Models;
using VengabusAPI.Services;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading;
using System.Threading.Tasks;

namespace VengabusAPI.Tests
{
    [TestClass]
    public class LockTest
    {
        public static MessagesController controller = new MessagesController();

        [TestMethod, Description("All messages should be deleted from queue")]
        public void DeleteAllMessagesFromQueue1()
        {
            //arrange
            //prepare the messages to be deleted
            TestHelper.SendMessagesToQueue(50);

            //prepare for the request
            var request = new HttpRequestMessage();
            
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            //act
            controller.DeleteAllMessagesInQueue(TestHelper.TestQueueName);

            //assert
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            Assert.AreEqual(finalMessageCount.ActiveMessageCount, 0, "There are still messages left in the queue");
            Console.WriteLine(finalMessageCount.ActiveMessageCount);
        }

        [TestMethod, Description("All messages should be deleted from queue")]
        public void DeleteAllMessagesFromQueue2()
        {
            //arrange
            //prepare the messages to be deleted
            TestHelper.SendMessagesToQueue(50);

            //prepare for the request
            var request = new HttpRequestMessage();
            
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            //act
            controller.DeleteAllMessagesInQueue(TestHelper.TestQueueName);

            //assert
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            Assert.AreEqual(finalMessageCount.ActiveMessageCount, 0, "There are still messages left in the queue");
            Console.WriteLine(finalMessageCount.ActiveMessageCount);
        }

        [TestMethod, Description("All messages should be deleted from queue")]
        public void DeleteAllMessagesFromQueue3()
        {
            //arrange
            //prepare the messages to be deleted
            TestHelper.SendMessagesToQueue(50);

            //prepare for the request
            var request = new HttpRequestMessage();
            
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            //act
            controller.DeleteAllMessagesInQueue(TestHelper.TestQueueName);

            //assert
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            Assert.AreEqual(finalMessageCount.ActiveMessageCount, 0, "There are still messages left in the queue");
            Console.WriteLine(finalMessageCount.ActiveMessageCount);
        }
    }
}
