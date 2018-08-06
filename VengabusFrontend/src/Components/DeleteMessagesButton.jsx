import React from 'react';
import { Glyphicon, Modal, Alert, Button } from 'react-bootstrap';
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointTypes';
import Lodash from 'lodash';

const defaultState = {
  show: false,
  modalBody: "",
  onDeletionConfirmed: () => { }
};

class DeleteMessagesButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
    this.onDeletionConfirmed = this.getOnDeletionConfirmed();
  }

  handleClose = () => {
    this.setState(defaultState);
  }

  handleOpening = () => {
    this.setState({ show: true });
    this.generateModalWarningBody().then(bodyResult => this.setState({ modalBody: bodyResult }));
    this.getOnDeletionConfirmed().then(onDeletionResult => this.setState({ onDeletionConfirmed: onDeletionResult }));
  }

  generateModalWarningBody = async () => {
    const vengaServiceBusService = serviceBusConnection.getServiceBusService();
    let numMessages = 0;
    let topicSubList = "";
    let response;

    switch (this.props.type) {
      case EndpointTypes.QUEUE:
        response = await vengaServiceBusService.getQueueDetails(this.props.endpointName);
        numMessages = response.data.activeMessageCount;
        break;
      case EndpointTypes.TOPIC:
        response = await vengaServiceBusService.listSubscriptions(this.props.endpointName);
        numMessages = Lodash.sumBy(response.data, (subscription) => {
          return subscription.activeMessageCount;
        });

        topicSubList = Lodash.map(response.data, (subscription) => {
          return subscription.name;
        });
        break;
      case EndpointTypes.SUBSCRIPTION:
        response = await vengaServiceBusService.getSubscriptionDetails(this.props.parentName, this.props.endpointName);
        numMessages = response.data.activeMessageCount;
        break;
      default: break;
    }

    return (
      <React.Fragment>
        <p>Are you sure you want to delete all the messages from {this.props.type} "{this.props.endpointName}" ?</p>

        {this.props.type === EndpointTypes.TOPIC ? this.generateTopicModalBody(topicSubList) : ""}

        <p>{numMessages} messages will be deleted <b>irreversibly</b>!</p >
      </React.Fragment>
    );
  }

  generateTopicModalBody = (topicSubList) => {
    const liArray = topicSubList.map(function (listValue, index) {
      return <li key={index}>{listValue}</li>;
    });

    return (
      <React.Fragment>
        <p> This action will delete all the messages from the next subscriptions: </p>
        <ul>
          {liArray}
        </ul>
      </React.Fragment>
    );
  }

  getOnDeletionConfirmed = async () => {
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
      <React.Fragment>
        <Button id="alertDelete" onClick={this.handleOpening} bsStyle="danger">
          Delete ALL messages&nbsp;
            <Glyphicon glyph="trash" />
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} >
          <Modal.Header>
            <Modal.Title>Delete all messages from {this.props.type}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Alert bsStyle="danger">
              {this.state.modalBody}
            </Alert >
          </Modal.Body>
          <Modal.Footer>
            <Button id="delete" onClick={this.state.onDeletionConfirmed} bsStyle="danger">Delete</Button>
            <Button id="cancel" onClick={this.handleClose} >Cancel</Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export { DeleteMessagesButton };
