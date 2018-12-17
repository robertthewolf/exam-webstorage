import React from "react";

export default class NewUser extends React.Component {
  state = {
    fullname: ""
  };

  updateInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addUser = e => {
    e.preventDefault();

    this.props.db.collection("workers").add({
      name: this.state.fullname,
      excused: [],
      unexcused: []
    });

    this.setState({
      fullname: ''
    });
  };

  render() {
    return (
      <form onSubmit={this.addUser} className="type-to-add">
        <input
          type="text"
          name="fullname"
          placeholder="New worker..."
          onChange={this.updateInput}
          value={this.state.fullname}
          autoComplete="off"
        />
      </form>
    );
  }
}
