import * as React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import HomeScreen from '../HomeScreen/HomeScreen';

const rendersomething = () => <Redirect to="/amazon" />;

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/:provider" component={HomeScreen} />
          <Route render={rendersomething} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
