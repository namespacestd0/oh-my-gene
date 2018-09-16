const geneStore = require('../config/geneStoreSQL');
const search = require('../config/elasticsearch')

module.exports = function (app) {
  // homepage statistics
  app.get('/api/gene/statistics', function (req, res) {
    geneStore.count().then(c => { // total records
      geneStore.count({
        distinct: true,
        col: 'user_id'
      }).then(u => { // registered users
        geneStore.count({
          distinct: true,
          col: 'gene_id'
        }).then(g => { // unique genes
          res.send({
            users: u,
            genes: g,
            records: c,
          });
        })
      })
    })
  })
  // retrive user collection
  app.get('/api/gene/user/all', function (req, res, next) {
    if (req.user) {
      next();
    } else {
      res.status(401).end();
    }
  }, function (req, res) {
    geneStore.findAll({
      where: {
        user_id: req.user.username
      }
    }).then(entries => {
      res.send(entries);
    });
  })

  // retrieve user marking of this gene
  app.get('/api/gene/user/:id', function (req, res) {
    if (req.user) {
      let result = {
        added: false,
        indexed: false
      }
      geneStore.findAll({
        where: {
          user_id: req.user.username,
          gene_id: req.params.id
        }
      }).then(entries => {
        res.send(entries)
      })
    } else {
      res.status(401).end()
    }
  })

  // add to database
  app.post('/api/gene/user/:id', function (req, res) {
    if (req.user) {
      // check if it's already included in the database
      geneStore.findAll({
        where: {
          user_id: req.user.username,
          gene_id: req.params.id,
        }
      }).then((result) => {
        // if the item can be found in saved record
        if (result.length) {
          res.status(409).send('Already exists.');
        } else {
          // create record in database
          geneStore.create({
            user_id: req.user.username,
            gene_id: req.params.id,
            indexed: false
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

  // delete from database TODO: authentication
  app.delete('/api/gene/user/:id', function (req, res) {
    geneStore.destroy({
      where: {
        user_id: req.user.username,
        gene_id: req.params.id
      }
    }).then(() => {
      res.send('Deletion Success.')
    })
  })
}