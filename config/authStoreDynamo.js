const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-1',
  accessKeyId: '***REMOVED***',
  secretAccessKey: '***REMOVED***'});

const dynamodb = new AWS.DynamoDB();

function putItem (table, item, callback) {
    let params = {
      TableName: table,
      Item: {}
    };
    for (let key of Object.keys(item)) {
      let val;
      if (typeof item[key] === 'string') {
        val = { S: item[key] };
      } else if (typeof item[key] === 'number') {
        val = { N: '' + item[key] };
      } else if (item[key] instanceof Array) {
        val = { SS: item[key] }; // sorted set
      }
      params.Item[key] = val;
    }
    dynamodb.putItem(params, callback);
  }
  
  function getAllItems (table, callback) {
    let params = {
      TableName: table
    };
  
    dynamodb.scan(params, callback); // 1MB max
  }
  
  function getItem (table, idName, id, callback) { // id name: name of primary key
    let params ={
      TableName: table,
      Key: {}
    };
    params.Key[idName] = { S: id };
  
    dynamodb.getItem(params, callback);
  }
  
  module.exports.putItem = putItem;
  module.exports.getAllItems = getAllItems;
  module.exports.getItem = getItem;
  