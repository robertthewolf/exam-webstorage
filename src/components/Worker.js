import React from 'react';
import firebase from 'firebase';

import Absence from './AbsenceToggle';

export default class Worker extends React.Component {
  constructor(props) {
    super(props);
    this.datePicker = React.createRef();
    this.state = {
        name: this.props.worker.name
    }
  }
  
  updateInput = e => {
    this.setState({
      name: e.target.value,
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const workerDoc = this.props.db
      .collection('workers')
      .doc(this.props.worker.id);

    const date = new Date(this.datePicker.current.value)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 1)

    workerDoc.update({
      unexcused: firebase.firestore.FieldValue.arrayUnion(date),
    });
  };

  renameWorker = e => {
    e.preventDefault();

    const workerDoc = this.props.db
      .collection('workers')
      .doc(this.props.worker.id);
      

      workerDoc.update({
        name: this.state.name,
      });

  }

  render() {
    return (
      <div className="worker">
        <header>
          <form onSubmit={this.renameWorker} className="type-to-add">
              <input
                type="text"
                placeholder="Give Me Name"
                onChange={this.updateInput}
                onBlur={this.renameWorker}
                value={this.state.name}
                autoComplete="off"
              />
          </form>
        </header>

        <div className="columns">
          <div>
            <h4 className={this.props.worker.unexcused.length >= 3 ? "red" : ""}>{this.props.worker.unexcused.length} unexused</h4>
            <ul>
              {this.props.worker.unexcused.map((date, index) => {
                const dateObject = date.toDate();
                return (
                  <Absence
                    db={this.props.db}
                    worker={this.props.worker.id}
                    date={date}
                    key={
                      index
                    }>{`${dateObject.getDate()}.${dateObject.getMonth() +
                    1}.`}</Absence>
                );
              })}
            </ul>
          </div>

          <div>
            <h4>{this.props.worker.excused.length} exused</h4>
            <ul>
              {this.props.worker.excused.map((date, index) => {
                const dateObject = date.toDate();
                return (
                  <Absence
                    db={this.props.db}
                    worker={this.props.worker.id}
                    date={date}
                    excused
                    key={
                      index
                    }>{`${dateObject.getDate()}.${dateObject.getMonth() +
                    1}.`}</Absence>
                );
              })}
            </ul>
          </div>
        </div>

        <form onSubmit={this.onSubmit.bind(this)}>
          {/* <DatePicker onChange={this.onChange} value={this.state.date} /> */}
          <input type="date" ref={this.datePicker} />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
