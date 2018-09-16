var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://search-elastic-gene-o3guxvznstg6agn7uqas6xcmru.us-west-1.es.amazonaws.com/',
  // log: 'trace'
});

module.exports = client;