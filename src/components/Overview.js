import React from 'react';

import Absence from './AbsenceToggle';
import Add from './AddAbsence';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.canvasElement = React.createRef();

    this.state = {
      week: [],
    };
  }

  componentWillMount() {
    const current = new Date(new Date().setHours(0, 0, 0, 0));

    var week = [];
    current.setDate(current.getDate() - current.getDay() + 1);
    for (var i = 0; i < 5; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    this.setState({ week: week });
  }

  prevWeek = () => {
      const newDates = this.state.week.map(day => new Date(new Date().setTime(day.getTime() - 7 * 24 * 3600000)))

      this.setState({week: newDates});

  }


  nextWeek = () => {
    const newDates = this.state.week.map(day => new Date(new Date().setTime(day.getTime() + 7 * 24 * 3600000)))

    this.setState({week: newDates});

}

  filterNames(category, currentDay) {
    if (this.props.data !== null) {
      return this.props.data.filter(worker =>
        worker[category]
          .map(date => date.seconds)
          .includes(currentDay.getTime() / 1000),
      );
    } else return [];
  }

  render() {
    if (this.canvasElement.current != null) {
      // update canvas

      const c = this.canvasElement.current;
      const ctx = c.getContext('2d');

      if (window !== undefined) { 
        c.width  = window.innerWidth;
        c.height = window.innerWidth /2;
      }

      // clear canvas
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.beginPath();

      // include last Friday and next Monday
      const monday = this.state.week[0];
      const lastFriday = new Date(
        new Date().setTime(monday.getTime() - 3 * 24 * 3600000),
      );
      const nextMonday = new Date(
        new Date().setTime(monday.getTime() + 7 * 24 * 3600000),
      );

      const fullWeek = [lastFriday, ...this.state.week, nextMonday];

      // loop through week
      fullWeek.forEach((day, index) => {
        const total =
          this.filterNames('unexcused', day).length +
          this.filterNames('excused', day).length;

        ctx.lineTo(
          (c.width / 6) * index,
          c.height - 30 * total,
        );
      });

      ctx.strokeStyle = '#FF3939';
      ctx.stroke();
    }

    return (
      <div className="overview">
        <h2>Overview</h2>
        <div className="week">
        <button className="arrow left" onClick={this.prevWeek}>◀</button>
        <button className="arrow right" onClick={this.nextWeek}>▶</button>
          {this.state.week.map((day, index) => (
            <div key={index}>
              <header>
                <h3>{day.toLocaleDateString('en', { weekday: 'long' })}</h3>
                <small>{`${day.getDate()}.${day.getMonth() +
                  1}.${day.getFullYear()}`}</small>
              </header>
              <ul>
                {this.filterNames('unexcused', day).map((worker, index) => (
                  <Absence
                    db={this.props.db}
                    worker={worker.id}
                    date={day}
                    key={index}>
                    {worker.name}
                  </Absence>
                ))}
              </ul>
              <ul>
                {this.filterNames('excused', day).map((worker, index) => (
                  <Absence
                    db={this.props.db}
                    worker={worker.id}
                    date={day}
                    excused
                    key={index}>
                    {worker.name}
                  </Absence>
                ))}
              </ul>

              <Add db={this.props.db} data={this.props.data} date={day} />
            </div>
          ))}
        </div>
        <canvas ref={this.canvasElement} />
      </div>
    );
  }
}
