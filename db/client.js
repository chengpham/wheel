
const knex = require('knex');
const knexfile = require('../knexfile');
module.exports = knex(knexfile[process.env.DATABASE_URL?'production':'development']);
