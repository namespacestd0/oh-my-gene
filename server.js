const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const geneStore = require('./config/geneStoreSQL');
const authStore = require('./config/authStoreDynamo');
const axios = require('axios');
const debug = require('debug');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const _ = require('lodash');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({ secret: 'OMG', resave: false, saveUninitialized: true }));
// app.use(express.static(path.join(__dirname, 'build')));

// authentication
require('./config/passport.js')(app);

// set a testing point to quickly see if the server is running correctly
app.get('/test', function (req, res) {
  return res.send('[express] server okay');
});

app.post('/auth/signup', function (req, res) {
  console.log(req.body);
  // search for duplicate
  authStore.getItem('omg-auth', 'username', req.body.username, (err, data) => {
    if (err) console.log(err, err.stack); // TODO error handling
    else if (_.isEmpty(data)) {
      // create user
      authStore.putItem('omg-auth', {
        username: req.body.username,
        password: req.body.password
      }, (err, data) => {
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

app.post('/auth/login',
  passport.authenticate('local'),
  function (req, res) {
    res.status(200).send('Sucessfully Logged In.');
  });

app.get('/auth/login', function (req, res, next) {
  if (req.user) {
    res.send(req.user.username);
  } else {
    res.status(403).end();
  }
})

app.get('/auth/logout', function (req, res, next) {
  req.logout()
  res.send('Logout Sucessful.')
})

// homepage statistics
app.get('/api/statistics', function (req, res) {
  geneStore.count().then(c => {
    // console.log("There are " + c + " records!");
    geneStore.count({
      distinct: true,
      col: 'user_id'
    }).then(u => {
      // console.log("There are " + u + " users!");
      geneStore.count({
        distinct: true,
        col: 'gene_id'
      }).then(g => {
        // console.log("There are " + g + " genes!");
        res.send([u, g, c]);
      })
    })
  })
})

// api access point from front end to retrieve all saved entries in database
app.get('/api/items/all', function (req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(403).end();
  }
}, function (req, res) {
  geneStore.findAll({
    where: {
      user_id: req.user.username
    }
  }).then(entries => { // query from sql server
    res.send(entries);  // send back to front end
  });
})

// add to database
app.post('/api/items/:id', function (req, res) {
  if (req.user) {
    // check if it's already included in the database
    geneStore.findAll({
      where: {
        user_id: req.user.username,
        gene_id: req.param('id')
      }
    }).then((result) => {
      // if the item can be found in saved record
      if (result.length) {
        res.status(409).send('Already exists.');
      } else {
        // create record in database
        geneStore.create({
          user_id: req.user.username,
          gene_id: req.param('id')
        }).then(() => {
          // communicate back to front end
          res.send('Insert Success.');
        })
      }
    })
  } else { // unauthorized
    res.status(401).end();
  }
})

app.delete('/api/items/:id', function (req, res) {
  geneStore.destroy({
    where: {
      user_id: req.user.username,
      gene_id: req.param('id')
    }
  }).then(() => {
    res.send('Deletion Success.')
  })
})

// set the entry point for web app to index.html under the build folder
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8080, () => {
  console.log('Server Listening on 8080.')
});