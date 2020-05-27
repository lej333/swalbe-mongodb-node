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

describe('lib/helpers/mongoDb.add', () => {

  const mongoOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    authSource: 'admin',
    retryWrites: true,
    ssl: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };

  const Db = new MongoDb(Schema, Vault.mongoServer, mongoOptions);

  const user = {
    username: 'test user',
    password: 'testing',
    admin: false,
    firstName: 'Test',
    namePrefix: '',
    lastName: 'User',
    hash: 'hashedstring'
  }

  before(async () => {
    await CleanTests.cleanUser(user.username);
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  const success = (result) => {
    Assert.isObject(result, 'Must return an object value');
    Assert.isDefined(result._id, 'Object must contain _id property which will be generated by MongoDb');
    Assert.isDefined(result.username, 'Object must contain username property');
    Assert.typeOf(result.creationDate, 'date', 'creationDate must have a date value');
    Assert.equal(result.username, user.username, 'Usernames have to be equal after creation');
  }

  it('add', async () => {
    const result = await Db.add(user, null);
    success(result);
    Assert.isDefined(result.hash, 'Object must contain a hash property');
  });

  it('add without returning hash', async () => {
    await CleanTests.cleanUser(user.username);
    const result = await Db.add(user, '-hash');
    success(result);
    Assert.isUndefined(result.hash, 'Object may not contain hash property');
  });

  it('add without user object', async () => {
    return Db.add(null, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.missingRecord);
    });
  });

  it('add with invalid user object', async () => {
    const invalid = {
      other: 'object than user schema'
    };
    return Db.add(invalid, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.include(err.message, '`hash` is required', 'Expects hash is required');
      Assert.include(err.message, '`firstName` is required', 'Expects firstName is required');
      Assert.include(err.message, '`lastName` is required', 'Expects lastName is required');
      Assert.include(err.message, '`username` is required', 'Expects username is required');
    });

  });

  it('add with same username twice', async () => {
    return Db.add(user, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      Assert.include(err.message, 'duplicate key error collection', 'Expects an duplicate error');
    });

  });

});