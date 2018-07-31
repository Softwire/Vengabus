import React from "react";
import { Glyphicon, Modal, Alert, Button } from "react-bootstrap";
import { serviceBusConnection } from '../AzureWrappers/ServiceBusConnection';
import { EndpointTypes } from '../Helpers/EndpointType';

class DeleteMessagesButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      numberOfMessages: 0
    };
  }

  handleClose = () => {
    this.setState({
      show: false,
      numberOfMessages: 0
    });
  }

  handleOpening = () => {
    let vengaServiceBusService = serviceBusConnection.getServiceBusService();
    let promiseResponse;
    switch (this.props.type) {
      case EndpointTypes.QUEUE:
        promiseResponse = vengaServiceBusService.getQueueDetails(this.props.endpointName);
        break;
      case EndpointTypes.TOPIC:
        promiseResponse = vengaServiceBusService.getTopicDetails(this.props.endpointName);
        break;
      case EndpointTypes.SUBSCRIPTION:
        promiseResponse = vengaServiceBusService.getSubscriptionDetails(this.props.parentName, this.props.endpointName);
        break;
      default: break;
    }

    promiseResponse.then((response) => {
      this.setState({
        show: true,
        numberOfMessages: response.data.activeMessageCount
      });
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleOpening} bsStyle="danger">
          Delete ALL messages&nbsp;
            <Glyphicon glyph="trash" />
        </Button>
        <Modal show={this.props && this.state.show} onHide={this.handleClose} >
          <Modal.Header>
            <Modal.Title>Delete all messages from {this.props.type}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Alert bsStyle="danger">
              <p>Are you sure you want to delete all the messages from the {this.props.endpointName} ?</p>
              <p>{this.state.numberOfMessages} messages will be deleted <b>irreversibly</b>!</p >
            </Alert >
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.onClick} bsStyle="danger" >Delete </Button>
            <Button onClick={this.handleClose} >Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export { DeleteMessagesButton };
