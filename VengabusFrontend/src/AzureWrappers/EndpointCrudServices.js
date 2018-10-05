import { serviceBusConnection } from './ServiceBusConnection';

/*
  Common Interface:
  {
    rename: function(oldName, newName),
    update: function(endpointData),
    delete: function(name)
  }
 */

export class QueueCrudService {
    constructor() {
        this.serviceBusService = serviceBusConnection.getServiceBusService();

        this.rename = this.serviceBusService.renameQueue;
        this.update = this.serviceBusService.updateQueue;
        this.delete = this.serviceBusService.deleteQueue;
    }
}

export class TopicCrudService {
    constructor() {
        this.serviceBusService = serviceBusConnection.getServiceBusService();

        this.rename = this.serviceBusService.renameTopic;
        this.update = this.serviceBusService.updateTopic;
        this.delete = this.serviceBusService.deleteTopic;
    }
}

export class SubscriptionCrudService {
    constructor(parentTopic) {
        this.serviceBusService = serviceBusConnection.getServiceBusService();
        this.parentTopic = parentTopic;

        this.rename = () => console.error('cannot rename subscriptions because #Microsoft');
        this.update = this.serviceBusService.updateSubscription;
        this.delete = (subscriptionName) => this.serviceBusService.deleteSubscription(subscriptionName, this.parentTopic);
    }
}
