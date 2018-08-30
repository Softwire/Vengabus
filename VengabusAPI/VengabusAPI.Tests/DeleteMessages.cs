﻿using System;
using System.Collections.Generic;
using System.Linq;
using VengabusAPI.Controllers;
using VengabusAPI.Models;
using System.Net.Http;
using System.Threading.Tasks;
using NUnit.Framework;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using FluentAssertions;

namespace VengabusAPI.Tests
{
    [TestFixture]
    public class DeleteMessages
    {
        [OneTimeSetUp]
        public void Setup()
        {
            ValidateConnectionSignature();
            CreateAllEndpoints();
        }
        public void ValidateConnectionSignature()
        {
            if (!TestHelper.sasLastUpdatedToday)
            {
                Assert.Fail("SAS string is outdated. Check TestHelper class and update it and also lastUpdateTime.");
            }
        }
        public void CreateAllEndpoints()
        {
            NamespaceManager x = null;// new NamespaceManager();
            x.CreateQueue(new QueueDescription("test"));
        }

        [OneTimeTearDown]
        public void DeleteAllEndpoints()
        {

        }

        [Test, Description("All messages should be deleted from queue, and the process should not throw errors when someone else is also consuming messages")]
        public void DeleteAllMessagesFromBusyQueue()
        {
            //arrange
            //prepare the messages to be deleted
            TestHelper.SendMessagesToQueue(50);

            var messageCount = TestHelper.getMessageCountInQueue();

            //prepare for the request
            var request = new HttpRequestMessage();

            var controller = new LiveMessagesController();
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            //act
            long deletedMessageCount = 0;
            //we want to simulate a busy queue, so we should do these in parallel
            Parallel.Invoke(
                () => controller.PurgeMessagesInQueue(TestHelper.TestQueueName),
                () => deletedMessageCount = TestHelper.DeleteAllMessagesFromQueue()
               );

            //assert
            //our test helper should delete some, but not all of the messages.
            deletedMessageCount.Should().BeLessThan(messageCount.ActiveMessageCount, "No messages are deleted by the backend!");
            Assert.IsTrue(deletedMessageCount > 0, "No messages is deleted by test code");
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            Assert.AreEqual(finalMessageCount.ActiveMessageCount, 0, "There are still messages left in the queue");
        }

        [Test, Description("All messages should be deleted from queue")]
        public void DeleteAllMessagesFromQueue()
        {
            //arrange
            //prepare the messages to be deleted
            TestHelper.SendMessagesToQueue(10);

            //prepare for the request
            var request = new HttpRequestMessage();

            var controller = new LiveMessagesController();
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            //act
            controller.PurgeMessagesInQueue(TestHelper.TestQueueName);

            //assert
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            Assert.AreEqual(finalMessageCount.ActiveMessageCount, 0, "There are still messages left in the queue");
            Console.WriteLine(finalMessageCount.ActiveMessageCount);
        }

        [Test, Description("The correct number of messages should be sent to a queue")]
        public void SendMessagesToQueue()
        {
            var initialMessageCount = TestHelper.getMessageCountInQueue();

            //arrange
            //prepare for the request
            var request = new HttpRequestMessage();

            var predefinedProperties = new Dictionary<string, object>();

            var customProperties = new Dictionary<string, object>();

            var controller = new LiveMessagesController();
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            var msg = new VengaMessage(customProperties, predefinedProperties, "adkajslkjdslakd", new Guid().ToString());

            var expectedMessageCount = 10;

            //act
            for (var i = 0; i < expectedMessageCount; i++)
            {
                controller.SendMessageToQueue(TestHelper.TestQueueName, msg);
            }

            //assert
            var finalMessageCount = TestHelper.getMessageCountInQueue();
            var actualMessageCount = finalMessageCount.ActiveMessageCount - initialMessageCount.ActiveMessageCount;
            Assert.AreEqual(actualMessageCount, expectedMessageCount, "The number of messages send to queue is incorrect");
        }

        [Test, Description("The correct messages should be received when getting all messages in queue")]
        public void GetAllMessagesFromQueue()
        {
            //arrange
            //prepare the messages to be received
            var messageCount = 10;

            TestHelper.DeleteAllMessagesFromQueue();
            TestHelper.SendMessagesToQueue(messageCount);

            //prepare for the request
            var request = new HttpRequestMessage();

            var controller = new LiveMessagesController();
            controller.Request = request;
            controller.Request.Headers.Add("Auth-SAS", TestHelper.sasString);

            //act
            var messageList = controller.ListMessagesInQueue(TestHelper.TestQueueName).ToList();
            Console.WriteLine(messageList);

            //assert
            Assert.AreEqual(messageList.Count(), messageCount);
            foreach (var message in messageList)
            {
                Assert.AreEqual(message.MessageBody, "This is a test message");
            }
        }

        
    }
}
