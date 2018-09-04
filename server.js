const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const geneStore = require('./aws/geneStoreSQL');
const axios = require('axios');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/test', function (req, res) {
  return res.send('[express] server okay');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api', function (req, res) {
  geneStore.findAll().then(entries => {
    // console.log(entries);
    res.send(entries);
  });
})

app.post('/api', function (req, res) {
  if (req.body.action === 'add') {
    axios.get('http://mygene.info/v3/gene/' + req.body.gene_id.toString()).then(resp => {
      // check if the id is valid
      if (resp.data.hasOwnProperty('error')) {
        res.send('Gene id does not exist.');
      } else {
        // check if it's already included in the database
        geneStore.findAll({
          where: {
            user_id: 'namespacestd0',
            gene_id: req.body.gene_id
          }
        }).then((result)=>{
          if (result.length) {
            res.send('Already exists.');
          } else {
            // create record in database
            geneStore.create({
              user_id: 'namespacestd0',
              gene_id: req.body.gene_id
            }).then(() => {
              res.send('Insert Success.');
            })
          }
        })
      }
    }).catch(error=>{
      res.send('Gene id does not exist.');
    });
  } else if (req.body.action === 'delete') {
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