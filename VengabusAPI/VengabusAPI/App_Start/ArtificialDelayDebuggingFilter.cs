using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace VengabusAPI.Startup
{
    public class ArtificialDelayDebuggingFilter : ActionFilterAttribute
    {
        public static bool IsActive = false;
        private int globalSecondsDelay = 5;
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            Task.Delay(globalSecondsDelay * 1000).Wait();
            base.OnActionExecuting(actionContext);
        }
    }
}