import React from "react";
import { Glyphicon, Modal, Alert, Button } from "react-bootstrap";
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';

class DeleteMessagesButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      numberOfMessages: 0,
      subscriptionList: [],
      onClick: () => { }
    };
  }

  handleClose = () => {
    this.setState({
      show: false,
      numberOfMessages: 0,
      subscriptionList: [],
      onClick: () => { }
    });
  }

  handleOpening = () => {
    const vengaServiceBusService = serviceBusConnection.getServiceBusService();
    const onClick = this.getOnClickFunction();

    switch (this.props.type) {
      case EndpointTypes.QUEUE:
        vengaServiceBusService.getQueueDetails(this.props.endpointName).then((response) => {
          this.setState({
            show: true,
            numberOfMessages: response.data.activeMessageCount,
            subscriptionList: [],
            onClick: onClick
          });
        });
        break;
      case EndpointTypes.TOPIC:
        vengaServiceBusService.listSubscriptions(this.props.endpointName).then((response) => {
          let numberOfMessages = 0;
          let subscriptionList = [];
          for (let id in response.data) {
            let subscription = response.data[id];
            numberOfMessages += subscription.activeMessageCount;
            subscriptionList.push(subscription.name);
          }

          this.setState({
            show: true,
            numberOfMessages: numberOfMessages,
            subscriptionList: subscriptionList,
            onClick: onClick
          });
        });
        break;
      case EndpointTypes.SUBSCRIPTION:
        vengaServiceBusService.getSubscriptionDetails(this.props.parentName, this.props.endpointName).then((response) => {
          this.setState({
            show: true,
            numberOfMessages: response.data.activeMessageCount,
            subscriptionList: [],
            onClick: onClick
          });
        });
        break;
      default: break;
    }
  }

  generateTopicModalBody = () => {
    let i = 0;
    return (
      <div>
        <p> This action will delete all the messages from the next subscriptions: </p>
        <ul>
          {this.state.subscriptionList.map(function (listValue) {
            i++;
            return <li key={i}>{listValue}</li>;
          })}
        </ul>
      </div>
    );
  }

  getOnClickFunction = () => {
    const vengaServiceBusService = serviceBusConnection.getServiceBusService();
    let deletionFunc;
    switch (this.props.type) {
      case EndpointTypes.TOPIC:
        deletionFunc = () => vengaServiceBusService.deleteTopicMessages(this.props.endpointName);
        break;
      case EndpointTypes.QUEUE:
        deletionFunc = () => vengaServiceBusService.deleteQueueMessages(this.props.endpointName);
        break;
      case EndpointTypes.SUBSCRIPTION:
        deletionFunc = () => vengaServiceBusService.deleteSubscriptionMessages(this.props.parentName, this.props.endpointName);
        break;
      default: break;
    }
    return () => {
      deletionFunc();
      this.handleClose();
    };
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleOpening} bsStyle="danger">
          Delete ALL messages&nbsp;
            <Glyphicon glyph="trash" />
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} >
          <Modal.Header>
            <Modal.Title>Delete all messages from {this.props.type}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Alert bsStyle="danger">
              <p>Are you sure you want to delete all the messages from {this.props.type} "{this.props.endpointName}" ?</p>

              {this.props.type === EndpointTypes.TOPIC ? this.generateTopicModalBody() : ""}

              <p>{this.state.numberOfMessages} messages will be deleted <b>irreversibly</b>!</p >
            </Alert >
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.state.onClick} bsStyle="danger" >Delete </Button>
            <Button onClick={this.handleClose} >Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export { DeleteMessagesButton };
