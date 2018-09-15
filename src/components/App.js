import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Collection from './Collection';
import NavBar from './NavBar';
import Members from './Members';
import About from './About';
import Login from './Login';
import Home from './Home';
import PageNotFound from './PageNotFound';
import View from './View';
import Signup from './Signup';
import axios from 'axios';
import Search from './Search';

class App extends Component {
  state = {
    isAuthenticated: false,
    username: null
  }
  componentDidMount() {
    axios.get('/auth/login').then(resp => {
      this.setState({
        isAuthenticated: true,
        username: resp.data
      })
      this.forceUpdate();
    }).catch((err) => {
      this.setState({
        isAuthenticated: false,
        username: null
      })
      this.forceUpdate();
    })
  }
  logoutHandler = () => {
    axios.get('/auth/logout').then(resp => {
      this.setState({
        isAuthenticated: false,
        username: null
      })
    }).catch((err) => {
      console.log(err)
    })
  }
  loginHandler = (user) => {
    this.setState({
      isAuthenticated: true,
      username: user
    })
  }
  render() {
    return (
      <Router>
        <div>
          <NavBar
            webSiteName='OhhMyGene'
            isAuthenticated={this.state.isAuthenticated}
            username={this.state.username}
            logoutHandler={this.logoutHandler}
          />
          <div className='container'>
            <Switch>
              <Route path='/' component={Home} exact />
              <Route path='/members' component={Members} />
              <Route path='/search' component={Search} />
              <Route path='/collection' render={() => <Collection 
                isAuthenticated={this.state.isAuthenticated} />} />
              <Route path='/login' render={() => <Login
                isAuthenticated={this.state.isAuthenticated}
                loginHandler={this.loginHandler} />} />
              <Route path='/signup' render={() => <Signup
                isAuthenticated={this.state.isAuthenticated}
                loginHandler={this.loginHandler} />} />
              <Route path='/view/:id' render={() => <View
                isAuthenticated={this.state.isAuthenticated} />} />
              <Route path='/about' component={About} />
              <Route path='/404' component={PageNotFound} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
          <br />
          <footer className="container-fluid text-center">
            <p> Created by Jerry Zhou <a href="https://github.com/namespacestd0/oh-my-gene" title="Github">View Source Code</a></p>
          </footer>
        </div>
      </Router>

    );
  }
}

// const Styles = {
//   fontSize: '20px',
//   marginBottom: '20px',
//   color: '#f4511e'
// }

export default App;
