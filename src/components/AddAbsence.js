import React, { Component } from "react";
import firebase from "firebase";

export default class Add extends Component {
  state = {
    name: ""
  };

  updateInput = e => this.setState({ name: e.target.value });

  addAbsence = e => {
    e.preventDefault();

    // get worker's id
    const id = this.props.data.filter(
      worker => worker.name === this.state.name
    )[0].id;

    // get document from database
    const workerDoc = this.props.db.collection("workers").doc(id);

    // write changes
    workerDoc.update({
      unexcused: firebase.firestore.FieldValue.arrayUnion(this.props.date)
    });

    // reset input
    this.setState({ name: "" });
  };

  render() {
    return (
      <form onSubmit={this.addAbsence} className="type-to-add">
        <input
          type="text"
          name="absence"
          placeholder="add..."
          list="workers"
          onChange={this.updateInput}
          value={this.state.name}
          autoComplete="off"
        />
        <datalist id="workers">
          {this.props.data !== null &&
            this.props.data.map(worker => (
              <option value={worker.name} key={worker.id} />
            ))}
        </datalist>
      </form>
    );
  }
}
