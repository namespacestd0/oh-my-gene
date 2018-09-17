# OhhMyGene (OMG)

[![GitHub license](https://img.shields.io/github/license/namespacestd0/oh-my-gene.svg)](https://github.com/namespacestd0/oh-my-gene/blob/master/LICENSE)
![GitHub package version](https://img.shields.io/github/package-json/v/badges/shields.svg)

Gene Annotation Collection Database WebApp with Searching Capability

## Features
 - Visualize Gene Annotation via MyGene.info API
 - Store interested Gene items in User Collections
 - Index choosen gene summary publicy for searching
 - Find and Filter contact information for other users
 
## Getting Started

    npm install
    node ./server/server.js
  
## Development

AWS DynamoDB, RDS, ElasticSearch services needed. Go to `server/config` folder to set the entry point.

    npm start
    nodemon ./server/server.js
  
## Build

    yarn build
    
## Resources

* [create-react-app](https://github.com/facebook/create-react-app)
* [reactivesearch](https://github.com/appbaseio/reactivesearch)
* [express](https://github.com/expressjs/express)
