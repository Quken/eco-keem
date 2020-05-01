import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { MenuView } from './components/menu';
import { Home } from './components/home';
import { MapView } from './components/map';

export const App = () => {
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }, []);

  return (
    <Router>
      <div className="App">
        <MenuView user={user} setUser={setUser}/>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/earth" component={() => <MapView user={user}/>}/>
        </Switch>
      </div>
    </Router>
  );
};
