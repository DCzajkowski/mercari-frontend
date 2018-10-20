import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomeScreen from '../HomeScreen/HomeScreen';
import PageNotFoundScreen from '../PageNotFoundScreen/PageNotFoundScreen';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/:provider" component={HomeScreen} />
          <Route component={PageNotFoundScreen} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
