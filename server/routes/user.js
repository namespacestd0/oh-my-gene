const passport = require('passport');
const authStore = require('../config/authStoreDynamo');

module.exports = function (app) {
    app.route('./api/auth')

    // register a user
    app.post('/auth/signup', function (req, res) {
        console.log(req.body);
        // search for duplicate
        authStore.getItem('omg-auth', 'username', req.body.username, (err, data) => {
            if (err) console.log(err, err.stack); // TODO error handling
            else if (_.isEmpty(data)) {
                // create user
                authStore.putItem('omg-auth', req.body, (err, data) => {
                    if (err) console.log(err, err.stack); // TODO error handling
                    else {
                        // log in automatically after creation
                        req.login(req.body, () => {
                            res.status(200).send('New User Registered.');
                        })
                    }
                });
            } else {
                res.status(409).send('Username Already Exists.');
            };
        })
    })

    // user login
    app.post('/auth/login',
        passport.authenticate('local'),
        function (req, res) {
            res.status(200).send('Sucessfully Logged In.');
        });

    // user log-in status
    app.get('/auth/login', function (req, res, next) {
        if (req.user) {
            res.send(req.user.username);
        } else {
            res.status(401).end();
        }
    })

    // user log out
    app.get('/auth/logout', function (req, res, next) {
        req.logout()
        res.send('Logout Sucessful.')
    })

    
// user contact sheet
app.get('/auth/all', function (req, res, next) {
    if (req.user) {
      next();
    } else {
      res.status(401).end();
      // next();
    }
  }, function (req, res) {
    authStore.getAllItems('omg-auth', (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.send(data.Items);
      }
    })
  })
  
}