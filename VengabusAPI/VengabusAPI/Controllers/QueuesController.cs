using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace VengabusAPI.Controllers
{
    public class AzureQueue
    {
        public AzureQueue(QueueDescription queueFromAzure)
        {
            name = queueFromAzure.Path;
            activeMessageCount = queueFromAzure.MessageCountDetails.ActiveMessageCount;
            deadletterMessageCount = queueFromAzure.MessageCountDetails.DeadLetterMessageCount;
        }

        public string name { get; set; }
        public long activeMessageCount { get; set; }
        public long deadletterMessageCount { get; set; }
    }
    public class SimpleParamInput
    {
        public int Id { get; set; }
        public string OtherInput { get; set; }
    }

    public enum EndpointType
    {
        Queue,
        Topic,
        Subscription
    }

    public class QueuesController : ApiController
    {
        private int nextKey = 3;
        private readonly Dictionary<int, string> queues = new Dictionary<int,string> { {1,"value1"}, {2,"value2"} };

        [HttpGet]
        [Route("getAll")]
        public Dictionary<int, string> GetDict()
        {
            return queues;
        }

        [Route("queues/list")]
        public IEnumerable<AzureQueue> Post([FromBody]string SAS)
        {
            //var auth = Request.Headers.Authorization.Parameter;
            //input is the SAS string here
            const string address = "https://vengabusdemo.servicebus.windows.net/";
           
            var namespaceManager = new NamespaceManager(address, TokenProvider.CreateSharedAccessSignatureTokenProvider(SAS));

            return namespaceManager.GetQueues().Select(q => new AzureQueue(q));
        }
        

        /*public void Post([FromBody]string value)
        {
            if(string.IsNullOrWhiteSpace(value)) { throw new ArgumentNullException(nameof(value));}
            queues.Add(nextKey, value);
        }*/

        public void put(int id, [FromBody]string value)
        {
            if (string.IsNullOrWhiteSpace(value)) { throw new ArgumentNullException(nameof(value)); }
            queues[id] = value;
            nextKey = Math.Max(nextKey, id + 1);
        }

        public void delete(int id)
        {
            if (!queues.ContainsKey(id)) { throw new ArgumentOutOfRangeException(nameof(id), id, "Id Not Found"); }
            queues.Remove(id);
        }
    }
}
/*
 * Sample codes for the Azure ServiceBus Library
 * namespace ConsoleApp2
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.ServiceBus;
    using Microsoft.ServiceBus.Messaging;
    using System.IO;

    class Program
    {
        const string ServiceBusConnectionString = "Endpoint=sb://vengabusdemo.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a8sPg0N79mgTNAfM57b7kwWsBCPK8TW7hwTwyexlK+8=";

        const string DemoQueueName = "demoqueue1";

        static NamespaceManager namespaceManager;

        static long[] ActiveMessageCount = new long[50];
        static long[] DeadLetterMessageCount = new long[50];

        static void Main(string[] args)
        {
            namespaceManager = GetNamespaceManager();
            var queueList = namespaceManager.GetQueues();
            int i = 0;
            foreach (var qd in queueList)
            {
                Console.WriteLine(value: $"Queue name: {qd.Path}, Active message count: {qd.MessageCountDetails.ActiveMessageCount}, DeadLetter message count: {qd.MessageCountDetails.DeadLetterMessageCount}");
                ActiveMessageCount[i] = qd.MessageCountDetails.ActiveMessageCount;
                DeadLetterMessageCount[i] = qd.MessageCountDetails.DeadLetterMessageCount;
                i++;
            }

            CreateDeadLetterMessages(DemoQueueName);

            SendRandomMessage(DemoQueueName);

            GetDeadLetterMessages(DemoQueueName);

            GetQueueMessages(DemoQueueName);

            DeleteQueueMessages(DemoQueueName);

            DeleteDeadLetterQueueMessages(DemoQueueName);
        }

        static void CreateDeadLetterMessages(string queueName)
        {
            Console.WriteLine("Creating DeadLetter Messages...");
            var queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, queueName);
            //send a random test message
            Random rnd = new Random();
            for (int i = 0; i < 10; i++)
            {
                var testMessage = $"This is a test message {i}";
                queueClient.Send(new BrokeredMessage(testMessage));
            }

            for (int i=0;i<10;i++)
            {
                var message = queueClient.Receive();
                message.DeadLetter();
            }

            Console.WriteLine("10 DeadLetter Messages Created! Press any key to continue...");

            Console.ReadKey();
        }

        static void DeleteQueueMessages(string queueName)
        {
            Console.WriteLine("Trying to delete all messages in the queue...");
            var queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString,queueName);
            while (true)
            {
                var messages = queueClient.Receive(TimeSpan.FromMilliseconds(500));
                if (messages == null)
                {
                    break;
                }
                Console.WriteLine($"1 message deleted from queue: {messages.GetBody<Stream>()}");
                messages.Complete();
            }
            Console.WriteLine("Messages Deleted! Press any key to continue...");

            Console.ReadKey();
        }

        static void DeleteDeadLetterQueueMessages(string queueName)
        {
            Console.WriteLine("Trying to delete all messages in the DeadLetter queue...");
            var queueClientMain = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, queueName);
            var deadLetterQueuePath = QueueClient.FormatDeadLetterPath(queueClientMain.Path);

            var queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, deadLetterQueuePath);
            while (true)
            {
                var messages = queueClient.Receive(TimeSpan.FromMilliseconds(500));
                if (messages == null)
                {
                    break;
                }
                Console.WriteLine($"1 message deleted from deadletter queue: {messages.GetBody<Stream>()}");
                messages.Complete();
            }
            Console.WriteLine("Messages Deleted! Press any key to continue...");

            Console.ReadKey();
        }

        static void SendRandomMessage(string queueName)
        {
            var queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, queueName);
            //send a random test message
            Random rnd = new Random();
            for (int i = 0; i < 50; i++)
            {
                var testMessage = $"This is a test message {i}";
                queueClient.Send(new BrokeredMessage(testMessage));
            }

            Console.WriteLine("50 Messages Sent! Press any key to continue...");

            Console.ReadKey();
        }

        static void GetQueueMessages(string queueName)
        {
            int i = 0;

            var queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, queueName);

            Console.WriteLine("Trying to peak at the queue...\n");

            Console.WriteLine($"Path to queue is {queueName}.");

            var msgCount = namespaceManager.GetQueue(queueName).MessageCountDetails.ActiveMessageCount;

            Console.WriteLine($"There are {(int)msgCount} active messages in the queue.\n");

            /*
             * The problem here is that, QueueClient.Peekbatch(number) does not guarantee to return the specified number
             * of messages. Instead, the given number is just an upper bound. We have to record the Sequence Number
             * of the last received message from the previous call of Peekbatch(), and call it again starting from 
             * the previous Sequence Message + 1 in order to read new messages, until we peeked at the correct number 
             * of messages.
             * *
long lastSequenceNumber = 0;

var initialPeekBatch = true;

            while (i<msgCount)
            {
                IEnumerable<BrokeredMessage> Messages;
                if (initialPeekBatch)
                {
                    initialPeekBatch = false;
                    Messages = queueClient.PeekBatch((int) msgCount).ToList();
                }
                else
                {
                    Messages = queueClient.PeekBatch((Int64) lastSequenceNumber, (int) msgCount - i).ToList();
                }

                Console.WriteLine($"\nReceived {Messages.Count<BrokeredMessage>()} messages.\n");

                foreach (var message in Messages)
                {
                    i++;
                    Console.WriteLine($"The {i}th message in the queue:{message.GetBody<Stream>()}");
                    lastSequenceNumber = message.SequenceNumber+1;
                }
            }
            
            Console.WriteLine("Press ENTER key to exit after receiving all the messages.");

            Console.ReadKey();
        }

        static void GetDeadLetterMessages(string queueName)
{
    int i = 0;

    var queueClientMain = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, queueName);

    var deadLetterQueuePath = QueueClient.FormatDeadLetterPath(queueClientMain.Path);

    var queueClient = QueueClient.CreateFromConnectionString(ServiceBusConnectionString, deadLetterQueuePath);

    Console.WriteLine($"Path to deadletter queue is {deadLetterQueuePath}.");

    var msgCount = namespaceManager.GetQueue(queueName).MessageCountDetails.DeadLetterMessageCount;

    Console.WriteLine("Trying to peak at the dead letter queue...\n");

    Console.WriteLine($"There are {(int)DeadLetterMessageCount[0]} messages in the dead letter queue.\n");

    /*
     * The problem here is that, QueueClient.Peekbatch(number) does not guarantee to return the specified number
     * of messages. Instead, the given number is just an upper bound. We have to record the Sequence Number
     * of the last received message from the previous call of Peekbatch(), and call it again starting from 
     * the previous Sequence Message + 1 in order to read new messages, until we peeked at the correct number 
     * of messages.
     * *
    long lastSequenceNumber = 0;

    var initialPeekBatch = true;

    while (i < DeadLetterMessageCount[0])
    {
        IEnumerable<BrokeredMessage> Messages;
        if (initialPeekBatch)
        {
            initialPeekBatch = false;
            Messages = queueClient.PeekBatch((int)DeadLetterMessageCount[0]).ToList();
        }
        else
        {
            Messages = queueClient.PeekBatch((Int64)lastSequenceNumber, (int)DeadLetterMessageCount[0] - i).ToList();
        }

        Console.WriteLine($"\nReceived {Messages.Count<BrokeredMessage>()} messages.\n");

        foreach (var message in Messages)
        {
            i++;
            Console.WriteLine($"The {i}th message in the dead letter queue:{message.GetBody<Stream>()}");
            lastSequenceNumber = message.SequenceNumber + 1;
        }
    }

    Console.WriteLine("Press ENTER key to exit after receiving all the messages.");

    Console.ReadKey();
}

private static NamespaceManager GetNamespaceManager()
{
    return NamespaceManager.CreateFromConnectionString(ServiceBusConnectionString);
}
    }
}
 * */
