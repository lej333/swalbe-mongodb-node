/**
 * This test tests the MongoDb class.
 * There are 6 basic functions to create/add, search, get one, delete one and update one in MongoDb collections.
 * This tests will use vacancies.users collection for test purposes, all test data will be erased after.
 */
process.env.NODE_ENV = 'test';

const Chai = require('chai');
const Assert = Chai.assert;
const Vault = require('schluessel');

const MongoDb = require('../../src/mongoDb');
const Schema = require('../helpers/users.model.js');
const CleanTests = require('../helpers/cleanTests');
const ErrorTests = require('../helpers/errorTests');
const Messages = require('../../src/messages');

describe('lib/helpers/mongoDb.constructor', () => {

  const mongoOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    authSource: 'admin',
    retryWrites: true,
    ssl: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };

  it('constructor', async () => {
    const Db = new MongoDb(Schema, Vault.mongoServer, mongoOptions);
    Assert.isDefined(Db.add, 'Class must contain add function');
    Assert.isDefined(Db.deleteById, 'Class must contain deleteById function');
    Assert.isDefined(Db.updateById, 'Class must contain updateById function');
    Assert.isDefined(Db.search, 'Class must contain search function');
    Assert.isDefined(Db.getById, 'Class must contain getById function');
    Assert.isUndefined(Db._initializeConnection, 'Class may not contain initializeConnection function');
  });

  it('constructor without schema', async () => {
    try {
      new MongoDb(null, Vault.mongoServer, mongoOptions);
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingSchema);
    }
  });

  it('constructor without schema (undefined)', async () => {
    try {
      new MongoDb(undefined, Vault.mongoServer, mongoOptions);
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingSchema);
    }
  });

  it('constructor without any params', async () => {
    try {
      new MongoDb();
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingSchema);
    }
  });

  it('constructor without mongo connection', async () => {
    try {
      new MongoDb(Schema, null, mongoOptions);
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingMongoConfig);
    }
  });

  it('constructor without mongo connection (undefined)', async () => {
    try {
      new MongoDb(Schema, undefined, mongoOptions);
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingMongoConfig);
    }
  });

  it('constructor without mongo options', async () => {
    try {
      new MongoDb(Schema, Vault.mongoServer, null);
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingMongoConfig);
    }
  });

  it('constructor without mongo options (undefined)', async () => {
    try {
      new MongoDb(Schema, Vault.mongoServer, undefined);
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingMongoConfig);
    }
  });

  it('constructor with only schema passed', async () => {
    try {
      new MongoDb(Schema);
      throw 'We expected an error!';
    } catch(err) {
      ErrorTests(err, Messages.missingMongoConfig);
    }
  });

});