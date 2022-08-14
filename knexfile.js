if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.HOST,
      database: process.env.DATABASE,
      user: process.env.USERNAME,
      password: process.env.PASSWORD
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.HOST,
      database: process.env.DATABASE,
      user: process.env.USERNAME,
      password: process.env.PASSWORD
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    },
    seeds: { 
      directory: './db/seeds'
    }
  }
};
