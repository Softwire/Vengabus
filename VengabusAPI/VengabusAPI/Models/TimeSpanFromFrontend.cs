using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VengabusAPI.Models
{
    public class TimeSpanFromFrontend
    {
        public string milliseconds { get; set; }
        public string seconds { get; set; }
        public string minutes { get; set; }
        public string hours { get; set; }
        public string days { get; set; }

        public TimeSpan AsTimeSpan()
        {
            return new TimeSpan(int.Parse(days), int.Parse(hours), int.Parse(minutes), int.Parse(seconds), int.Parse(milliseconds));
        }
    }
}