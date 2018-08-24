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
            ApplyDescriptionChanges(description, topicData);

            namespaceManager.UpdateTopic(description);
        }

        public void ApplyDescriptionChanges(TopicDescription existingDescription, VengaTopicUpload updateData)
        {
            existingDescription.SupportOrdering = updateData.supportOrdering;
            existingDescription.EnablePartitioning = updateData.enablePartitioning;
            existingDescription.AutoDeleteOnIdle = updateData.autoDeleteOnIdle.AsTimeSpan();
            existingDescription.Status = updateData.topicStatus;
            existingDescription.RequiresDuplicateDetection = updateData.requiresDuplicateDetection;
            existingDescription.MaxSizeInMegabytes = updateData.maxSizeInMegabytes;

        }

        [HttpPost]
        [Route("topics/rename")]
        public void RenameQueue([FromBody]Rename names)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            TopicDescription description = namespaceManager.GetTopic(names.oldName);
            if (description.EnablePartitioning)
            {
                throw new Exception("Partitioned topics cannot be renamed.");
            }
            namespaceManager.RenameTopic(names.oldName, names.newName);
        }

        [HttpDelete]
        [Route("topics/delete/{topicName}")]
        public void DeleteQueue(string topicName)
        {
            NamespaceManager namespaceManager = CreateNamespaceManager();
            namespaceManager.DeleteTopic(topicName);
        }

    }
}
 