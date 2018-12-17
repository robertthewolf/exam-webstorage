import React from 'react';
import firebase from 'firebase';

// css
import './css/App.scss';
import 'react-tippy/dist/tippy.css';

// components
import Overview from './components/Overview';
import Worker from './components/Worker';
import NewUser from './components/NewUser';


// firebase configuration
firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
});

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true,
});

export default class Index extends React.Component {
  state = {
    data: null
  };

  componentWillMount() {

    // set data updater
    db.collection('workers').onSnapshot(res => {
      const data = res.docs.map(doc => {
        const res = doc.data();
        res.id = doc.id; // include the worker id in the data
        return res;
      });
      this.setState({ data: data });
    });
  }

  render() {
    return (
      <div>

        <Overview data={this.state.data} db={db} />

        <h2>Workers</h2>
        <div className="workers">
          {this.state.data !== null &&
            this.state.data
              .sort()
              .map((worker, index) => (
                <Worker worker={worker} db={db} key={index} />
              ))}
        </div>
        
        <NewUser db={db} />

      </div>
    );
  }
}
