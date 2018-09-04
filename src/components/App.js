import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Collection from './Collection';
import NavBar from './NavBar';
import Members from './Members';
import About from './About';
import Login from './Login';
import Home from './Home';
import PageNotFound from './PageNotFound';

class App extends Component {
  render() {
    return (
      <Router>
      <div>
        <NavBar 
          webSiteName = 'OhhMyGene'
        />
        <div className='container'>
          <Switch>
            <Route path='/' component={Home} exact/>
            <Route path='/collection' component={Collection}/>
            <Route path='/members' component={Members}/>
            <Route path='/about' component={About}/>
            <Route path='/login' component={Login}/>
            <Route component={PageNotFound}/>
          </Switch>
        </div>
      </div>
      </Router>

    );
  }
}

export default App;
