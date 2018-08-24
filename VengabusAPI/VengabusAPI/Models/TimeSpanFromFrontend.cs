using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VengabusAPI.Models
{

    public static class TimeSpanExtension
    {
        public static TimeSpanFromFrontend AsObjectForFrontEnd(this TimeSpan input)
        {
            return new TimeSpanFromFrontend
            (
                input.Days.ToString(),
                input.Hours.ToString(),
                input.Minutes.ToString(),
                input.Seconds.ToString(),
                input.Milliseconds.ToString()
            );
        }
    }

    public class TimeSpanFromFrontend
    {
        public TimeSpanFromFrontend(string days, string hours, string minutes, string seconds, string milliseconds)
        {
            this.days = days;
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds;
            this.milliseconds = milliseconds;

            span = new TimeSpan(int.Parse(days), int.Parse(hours), int.Parse(minutes), int.Parse(seconds), int.Parse(milliseconds));
        }

        public string milliseconds { get; }
        public string seconds { get; }
        public string minutes { get; }
        public string hours { get; }
        public string days { get; }

        private TimeSpan span { get; }
        public TimeSpan AsTimeSpan() => span;
    }
}