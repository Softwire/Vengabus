var EndpointTypes = Object.freeze({
    QUEUE: "queue",
    TOPIC: "topic",
    SUBSCRIPTION: "subscription",
    MESSAGE: "message"
});


var typeToTitle = (type) => {
    switch (type) {
        case EndpointTypes.MESSAGE:
            return "Messages";
        case EndpointTypes.SUBSCRIPTION:
            return "Subscriptions";
        case EndpointTypes.QUEUE:
            return "Queues";
        case EndpointTypes.TOPIC:
            return "Topics";
    }
}
export { EndpointTypes, typeToTitle };