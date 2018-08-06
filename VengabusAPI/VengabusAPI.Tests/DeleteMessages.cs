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

namespace VengabusAPI.Tests
{
    [TestClass]
    public class DeleteMessages
    {
        [TestMethod, Description("The correct number of messages should be sent to a queue")]
        public void SendMessagesToQueue()
        {
            var initialMessageCount = TestHelper.getMessageCountInQueue();

            //arrange
            //prepare for the request
            var request = new HttpRequestMessage();

            var predefinedProperties = new Dictionary<string, object>();
            predefinedProperties.Add("MessageId", "asdsdsasdasdsda");

            var customProperties = new Dictionary<string, object>();
            customProperties.Add("MessaasdasdgeId", "asdsdsaasddsdasdsda");

            var controller = new MessagesController();
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            var msg = new VengaMessage(customProperties,predefinedProperties,"adkajslkjdslakd");

            var messageCount = 10;

            //act
            for (var i = 0; i < messageCount; i++)
            {
                controller.SendMessageToQueue(TestHelper.TestQueueName, msg);
            }

            //assert
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            Assert.AreEqual(finalMessageCount.ActiveMessageCount - initialMessageCount.ActiveMessageCount, messageCount);
        }

        [TestMethod, Description("All messages should be deleted from queue")]
        public void DeleteAllMessagesFromQueue()
        {
            //arrange
            //prepare the messages to be deleted
            TestHelper.SendMessagesToQueue(10);

            //prepare for the request
            var request = new HttpRequestMessage();

            var controller = new MessagesController();
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            //act
            controller.DeleteAllMessagesInQueue(TestHelper.TestQueueName);

            //assert
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            Assert.AreEqual(finalMessageCount.ActiveMessageCount, 0);
        }
    }
}
