using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace VengabusAPI.Startup
{
    /// <summary>
    /// This is a filter to be used whilst debugging async behaviour on the FrontEnd.
    /// It inserts an artificial delay on all endpoint calls.
    /// </summary>
    public class ArtificialDelayDebuggingFilter : ActionFilterAttribute
    {
        public static bool IsActive = false;
        private int globalSecondsDelay = 5;
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            //Pause for some period, and then continue as usual.
            Task.Delay(globalSecondsDelay * 1000).Wait();
            base.OnActionExecuting(actionContext);
        }
    }
}