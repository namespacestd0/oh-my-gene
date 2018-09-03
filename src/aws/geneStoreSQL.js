const Sequelize = require('sequelize');

const DB_Name = 'gene',
    DB_endpoint = 'gene-db.crv3cawb7jup.us-west-1.rds.amazonaws.com',
    DB_username = '***REMOVED***',
    DB_password = '***REMOVED***';

// initiate connection
const pgClient = new Sequelize(DB_Name, DB_username, DB_password, {
    host: DB_endpoint,
    dialect: 'postgres'
})

// define the schema of database table
const Gene = pgClient.define('gene', // model name
    {
        user_id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        gene_id: {
            type: Sequelize.STRING,
        },
        created: {
            type: Sequelize.BIGINT,
        }
    }
);

// sync the model and export it
Gene.sync().then(()=>{
    console.log('Postgres Connection Ready.');
})

module.exports = Gene;