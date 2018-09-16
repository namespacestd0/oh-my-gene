const Sequelize = require('sequelize');

const DB_Name = 'gene',
    DB_endpoint = 'gene-db.crv3cawb7jup.us-west-1.rds.amazonaws.com',
    DB_username = process.env.DB_Username,
    DB_password = process.env.DB_Password;

// initiate connection
const sequelize = new Sequelize(DB_Name, DB_username, DB_password, {
    host: DB_endpoint,
    dialect: 'postgres',
    logging: false
})

// define the schema of database table
const Gene = sequelize.define('fav_genes', // model name
    {
        user_id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        gene_id: {
            type: Sequelize.STRING,
        },
        indexed: {
            type: Sequelize.BOOLEAN,
        }
    }
);

// sync the model and export it
Gene.sync().then(()=>{
    console.log('AWS RDS Postgres Connection Ready.');
})

module.exports = Gene;