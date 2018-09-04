const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const geneStore = require('./aws/geneStoreSQL');
const axios = require('axios');

const app = express();  // create server instance

app.use(bodyParser.json()) // middleware to read json format API call response

app.use(express.static(path.join(__dirname, 'build'))); // expose the build folder to public access

// set the entry point for web app to index.html under the build folder
app.get('/', function (req, res) { 
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// set a testing point to quickly see if the server is running correctly
app.get('/test', function (req, res) { 
  return res.send('[express] server okay');
});

// api access point from front end to retrieve all saved entries in database
app.get('/api', function (req, res) {
  geneStore.findAll().then(entries => { // query from sql server
    res.send(entries);  // send back to front end
  });
})

// api access point from front end to save new records or to delete records
app.post('/api', function (req, res) {
  // differentiate request type from front end
  if (req.body.action === 'add') { 
    // request by calling mygene.info api
    axios.get('http://mygene.info/v3/gene/' + req.body.gene_id.toString()).then(resp => {
      // check if the response indicate the query is successful
      if (resp.data.hasOwnProperty('error')) {
        // communicate back to front end the failed query result and reason
        res.send('Gene id does not exist.');
      } else {
        // check if it's already included in the database
        geneStore.findAll({
          where: {
            user_id: 'namespacestd0',
            gene_id: req.body.gene_id
          }
        }).then((result)=>{
          // if the item can be found in saved record
          if (result.length) {
            res.send('Already exists.');
          } else {
            // create record in database
            geneStore.create({
              user_id: 'namespacestd0',
              gene_id: req.body.gene_id
            }).then(() => {
              // communicate back to front end
              res.send('Insert Success.');
            })
          }
        })
      }
    }).catch(error=>{
      res.send(error);
    });
  // if the request is a deletion request
  } else if (req.body.action === 'delete') {
    // use sequalize delete query to delete the record
    geneStore.destroy({
      where: {
        user_id: 'namespacestd0',
        gene_id: req.body.gene_id
      }
    }).then(()=>{
      res.send('Deletion Success.')
    })
  }
})

app.listen(8080);