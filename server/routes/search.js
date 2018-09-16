const search = require('../config/elasticsearch');
const geneStore = require('../config/geneStoreSQL');

module.exports = function (app) {

  search.ping({
    requestTimeout: 30000,
  }, function (error) {
    if (error) {
      console.log('elasticsearch cluster is down!');
    } else {
      console.log('AWS Elasticserch Connection Ready.')
    }
  });

  app.get('/api/search/ping', function (req, res) {
    search.ping({
      requestTimeout: 30000,
    }, function (error) {
      if (error) {
        res.status(500).send('elasticsearch cluster is down!');
      } else {
        res.send('elasticserch connection okay.')
      }
    });
  })

  app.put('/api/search/:id', function (req, res) {
    if (req.user) {
      search.exists({
        index: 'genes',
        type: 'summary',
        id: req.params.id
      }, function (err, response, status) {
        if (err) {
          console.log(err)
          return res.status(500).send(err)
        } else if (response) {
          // gene already indexed, update user info only
          search.update({
            index: 'genes',
            type: 'summary',
            id: req.params.id,
            body: {
              script: {
                source:'ctx._source.user.add(params.user)',
                params: { user: req.user.username }
              }
            }
          }, function (err, response, status) {
            if (err) {
              console.log(err)
              return res.status(500).send(err)
            }
            // update DynamoDB record
            geneStore.update({
              indexed: true
            }, {
              where: {
                user_id: req.user.username,
                gene_id: req.params.id
              }
            }).then(resp => {
              res.status(status).send({
                elasticsearch: response, 
                dynamodb: resp});
            }).catch(err => {
              res.status(500).send(err);
            })            
          });
        } else {
          // index the record
          search.create({
            index: 'genes',
            type: 'summary',
            id: req.params.id,
            body: {
              user: [req.user.username],
              ...req.body
            }
          }, function (err, response, status) {
            if (err) {
              console.log(err)
              return res.status(500).send(err)
            }
            // update DynamoDB record
            geneStore.update({
              indexed: true
            }, {
              where: {
                user_id: req.user.username,
                gene_id: req.params.id
              }
            }).then(resp => {
              res.status(status).send({
                elasticsearch: response, 
                dynamodb: resp});
            }).catch(err => {
              res.status(500).send(err);
            })
          })
        }
      });
    }
    else {
      // login needed
      res.status(401).end()
    }
  })

  app.delete('/api/search/:id', function (req, res) {
    if (req.user) {
      search.exists({
        index: 'genes',
        type: 'summary',
        id: req.params.id
      }, function (err, response, status) {
        if (err) {
          console.log(err)
          return res.status(500).send(err)
        } else if (response) {
          // gene already indexed, update user info only
          search.update({
            index: 'genes',
            type: 'summary',
            id: req.params.id,
            body: {
              script: {
                source:'ctx._source.user.remove(ctx._source.user.indexOf(params.user))',
                params: { user: req.user.username }
              }
            }
          }, function (err, response, status) {
            if (err) {
              console.log(err)
              return res.status(500).send(err)
            }
            search.get({
              index: 'genes',
              type: 'summary',
              id: req.params.id
            }, function (err, response, status) {
              if (err) {
                console.log(err)
                return res.status(500).send(err)
              } else if (response._source.user.length) {
                // do not need to delete the item
                // update DynamoDB record
                geneStore.update({
                  indexed: false
                }, {
                  where: {
                    user_id: req.user.username,
                    gene_id: req.params.id
                  }
                }).then(resp => {
                  res.status(status).send({
                    elasticsearch: response, 
                    dynamodb: resp});
                }).catch(err => {
                  res.status(500).send(err);
                })            
              } else {
                // remove from index
                search.delete({
                  index: 'genes',
                  type: 'summary',
                  id: req.params.id
                }, function (err, response, status) {
                  if (err) {
                    console.log(err)
                    return res.status(500).send(err)
                  } else {
                    geneStore.update({
                      indexed: false
                    }, {
                      where: {
                        user_id: req.user.username,
                        gene_id: req.params.id
                      }
                    }).then(resp => {
                      res.status(status).send({
                        elasticsearch: response, 
                        dynamodb: resp});
                    }).catch(err => {
                      res.status(500).send(err);
                    })     
                  }
                });
              }
            });
          });
        } else {
          res.status(400).end('The item is not indexed.');
        }
      });
    }
    else {
      // login needed
      res.status(401).end()
    }
  })
}