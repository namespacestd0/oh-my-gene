const passport = require('passport');
const { Strategy } = require('passport-local');
const authStore = require('./authStoreDynamo');
const _ = require('lodash');

passport.use(new Strategy(
  function (username, password, done) {
    authStore.getItem('omg-auth', 'username', username, (err, data) => {
      if (err) { return done(err); } // server error
      else if (_.isEmpty(data)) { // no such username found
        return done(null, false);
      } else {
        if (data.Item.password.S !== password) { 
          return done(null, false); 
        } else {
          return done(null, { username });
        }
      };
    })
  }
));


module.exports = function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user)
  });

  passport.deserializeUser((user, done) => {
    done(null, user)
  });
}