using System;
using System.Linq;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Web.Http;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;
using VengabusAPI.Models;

namespace VengabusAPI.Controllers
{

    public class TopicsController : VengabusController
    {
        
        [HttpGet]
        [Route("topics")]
        //list all topics in a service bus
        public IEnumerable<VengaTopic> ListTopics()
        {
            var namespaceManager = CreateNamespaceManager();
            var topics = namespaceManager.GetTopics().Select(t => new VengaTopic(t));
            return topics.OrderBy(t => t.name, StringComparer.CurrentCultureIgnoreCase);
        }

        [HttpGet]
        [Route("topics/{topicName}")]
        public VengaTopic GetDetails(string topicName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            return new VengaTopic(namespaceManager.GetTopic(topicName));
        }

        [HttpPost]
        [Route("topics/update")]
        public void UpdateQueue([FromBody]VengaTopicUpload topicData)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();

            TopicDescription description = namespaceManager.GetTopic(topicData.name);
            description = UpdateDescription(description, topicData);

            namespaceManager.UpdateTopic(description);
        }

        [HttpPost]
        [Route("topics/rename/{oldName}")]
        public void RenameQueue(string oldName, [FromBody] string newName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            namespaceManager.RenameTopic(oldName, newName);
        }

        public TopicDescription UpdateDescription(TopicDescription description, VengaTopicUpload topicData)
        {
            description.SupportOrdering = topicData.supportOrdering;
            description.EnablePartitioning = topicData.enablePartitioning;
            description.AutoDeleteOnIdle = topicData.autoDeleteOnIdle.AsTimeSpan();
            description.Status = topicData.topicStatus;
            description.RequiresDuplicateDetection = topicData.requiresDuplicateDetection;
            description.MaxSizeInMegabytes = topicData.maxSizeInMegabytes;

            return description;
        }

    }
}
 