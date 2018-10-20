import * as React from 'react';
import allegroLogo from './Allegro.png';
import './HomeScreen.css';

const HomeScreen = () => (
  <div className="HomeScreenContainer">
    <h1>Welcome to Sharating!</h1>
    <h2>Share your reviews from: </h2>
    <div className="providers">
      <div className="provider">
        <div>
          <a href="#">
            <img src={allegroLogo} />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default HomeScreen;
