const Schema = require('../helpers/users.model');
const MongoDb = require('../../src/mongoDb');
const Vault = require('schluessel');

const cleanUser = async (username) => {
  const mongoOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    authSource: 'admin',
    retryWrites: true,
    ssl: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };
  const db = new MongoDb(Schema, Vault.mongoServer, mongoOptions);
  const search = {
    username: username
  };
  const result = await db.search(search);
  if (result && result.length !== 0) {
    await db.deleteById(result[0].id, null);
  }
  return true;
};

module.exports = {
  cleanUser
};