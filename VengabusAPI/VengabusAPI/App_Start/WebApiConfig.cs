using System.Web.Http;
using System.Web.Http.Cors;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using VengabusAPI.Startup;

namespace VengabusAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            if(ArtificialDelayDebuggingFilter.IsActive) { config.Filters.Add(new ArtificialDelayDebuggingFilter()); }

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.EnableCors(new EnableCorsAttribute(origins: "*", headers: "*", methods: "*"));

            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            json.SerializerSettings.Converters = new JsonConverter[] { new StringEnumConverter() };
            json.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;


        }
    }
}
