const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({ secret: 'OMG', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, '../build')));

app.post('/test', function (req, res) {
  return res.send({
    header: req.headers, 
    body: req.body, 
    query: req.query});
});

// user API
require('./config/passport')(app);
require('./routes/user')(app);

// gene API
require('./routes/gene')(app);

// search API
require('./routes/search')(app);

// entry point
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(8080, () => {
  console.log('Express Server Listening on 8080.')
});
