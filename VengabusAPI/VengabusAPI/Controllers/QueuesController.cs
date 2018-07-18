using System;
using System.Collections.Generic;
using System.Web.Http;

namespace VengabusAPI.Controllers
{
    public class QueuesController : ApiController
    {
        private int nextKey = 3;
        private readonly Dictionary<int, string> queues = new Dictionary<int,string> { {1,"value1"}, {2,"value2"} };

        // GET: api/Queues/
        public IEnumerable<string> Get()
        {
            return queues.Values;
        }

        //// GET: api/Queues
        [HttpGet]
        [Route("GetDict")]
        public Dictionary<int, string> GetDict()
        {
            return queues;
        }

        // GET: api/Queues/5
        public string Get(int id)
        {
            return queues[id];
        }

        // POST: api/Queues
        public void Post([FromBody]string value)
        {
            if(string.IsNullOrWhiteSpace(value)) { throw new ArgumentNullException(nameof(value));}
            queues.Add(nextKey, value);
        }

        // PUT: api/Queues/5
        public void Put(int id, [FromBody]string value)
        {
            if (string.IsNullOrWhiteSpace(value)) { throw new ArgumentNullException(nameof(value)); }
            queues[id] = value;
            nextKey = Math.Max(nextKey, id + 1);
        }

        // DELETE: api/Queues/5
        public void Delete(int id)
        {
            if (!queues.ContainsKey(id)) { throw new ArgumentOutOfRangeException(nameof(id), id, "Id Not Found"); }
            queues.Remove(id);
        }
    }
}
