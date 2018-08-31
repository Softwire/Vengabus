var EndpointTypes = Object.freeze({
    QUEUE: "queue",
    TOPIC: "topic",
    SUBSCRIPTION: "subscription",
    MESSAGE: "message",
    DEADLETTER: "deadletters"
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
        case EndpointTypes.DEADLETTER:
            return "Deadletters";
        default:
            throw new Error('Invalid endpoint type.');
    }
}
export { EndpointTypes, typeToTitle };