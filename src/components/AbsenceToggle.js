import React, { Component } from "react";
import firebase from "firebase";
import { Tooltip } from "react-tippy";

var pressTimer;

export default class Absence extends Component {
  toggleAbsence = () => {
    const workerDoc = this.props.db
      .collection("workers")
      .doc(this.props.worker);

    const removeArray = this.props.excused ? "excused" : "unexcused";
    const addArray = !this.props.excused ? "excused" : "unexcused";

    let updateObject = {};

    updateObject[removeArray] = firebase.firestore.FieldValue.arrayRemove(
      this.props.date
    );
    updateObject[addArray] = firebase.firestore.FieldValue.arrayUnion(
      this.props.date
    );

    workerDoc.update(updateObject);
  };

  onMouseDown = () => {
    // start timer for 'hold to delete'

    pressTimer = window.setTimeout(this.deleteAbsence, 1000);
    return false;
  };

  onMouseUp = () => {
    // stop timer for 'hold to delete'

    clearTimeout(pressTimer);
    return false;
  };

  deleteAbsence = () => {
    const workerDoc = this.props.db
      .collection("workers")
      .doc(this.props.worker);

    const removeArray = this.props.excused ? "excused" : "unexcused";

    let updateObject = {};

    updateObject[removeArray] = firebase.firestore.FieldValue.arrayRemove(
      this.props.date
    );

    workerDoc.update(updateObject);
  };

  render() {
    return (
      <Tooltip title="Click to excuse, hold to delete." size="small">
        <li
          className={this.props.excused ? "excused" : "unexcused"}
          onClick={this.toggleAbsence}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        >
          {this.props.children}
        </li>
      </Tooltip>
    );
  }
}
