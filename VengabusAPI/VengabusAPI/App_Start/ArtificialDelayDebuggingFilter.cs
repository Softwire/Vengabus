using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace VengabusAPI.Startup
{
    /// <summary>
    /// This is a filter to be used whilst debugging async behaviour on the FrontEnd.
    /// It inserts an artificial delay on all endpoint calls.
    /// </summary>
    /// 
    /// To insert an artificial delay of "delay" milliseconds in processing promises on the FrontEnd the following method can be used:
    /*  delayPromise(delay) {
            return function(data)
                {
                return new Promise(function(resolve, reject) {
                    setTimeout(function () {
                        resolve(data);
                    }, delay);
                });
            }
        } */
    /// Then change
    /// myPromise.then(result => myFunction(result));
    /// to
    /// myPromise.then(this.delayPromise(5000)).then((result) => myFunction(result));
    /// 
    public class ArtificialDelayDebuggingFilter : ActionFilterAttribute
    {
        public static bool IsActive = true;
        private int globalSecondsDelay = 1;
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            //Pause for some period, and then continue as usual.
            Task.Delay(globalSecondsDelay * 1000).Wait();
            base.OnActionExecuting(actionContext);
        }
    }
}