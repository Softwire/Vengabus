import Dialog from "react-bootstrap-dialog";
import React from "react";
import { Glyphicon, Button } from "react-bootstrap";

export default class DeleteMessageButton extends React.Component {
  constructor(props) {
    super(props);
    this.alertPopup = this.alertPopup.bind(this);
  }

  alertPopup() {
    this.dialog.show({
      body: "Are you sure you want to delete all the messages ?",
      actions: [
        Dialog.DefaultAction("Delete", this.props.onClick, "btn-danger"),
        Dialog.CancelAction()
      ]
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.alertPopup} bsStyle="danger">
          Delete messages&nbsp;
          <Glyphicon glyph="trash" />
        </Button>
        <Dialog
          ref={el => {
            this.dialog = el;
          }}
        />
      </div>
    );
  }
}
