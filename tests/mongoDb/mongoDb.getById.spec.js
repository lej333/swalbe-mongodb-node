/**
 * This test tests the MongoDb class.
 * There are 6 basic functions to create/add, search, get one, delete one and update one in MongoDb collections.
 * This tests will use vacancies.users collection for test purposes, all test data will be erased after.
 */
process.env.NODE_ENV = 'test';

const Chai = require('chai');
const Assert = Chai.assert;
const Mongoose = require('mongoose');
const Vault = require('schluessel');

const MongoDb = require('../../src/mongoDb');
const Schema = require('../helpers/users.model.js');
const CleanTests = require('../helpers/cleanTests');
const ErrorTests = require('../helpers/errorTests');
const Messages = require('../../src/messages');

describe('lib/helpers/mongoDb.getById', () => {

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

  it('getById', async () => {
    const result = await Db.add(user, null);
    Assert.isObject(result, 'Should not be an empty object');
    Assert.isDefined(result.id, 'Should contain id property');

    const one = await Db.getById(result.id, null);
    Assert.isObject(one, 'Should not be an empty object');
    Assert.isDefined(one.id,'Should contain id property');
    Assert.equal(one.id, result.id, 'Found user object should have same id');

    return true;
  });

  it('getById without user id', async () => {
    return Db.getById(null, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.idNotValid);
    });
  });

  it('getById with non existing user id', async () => {
    const userId = Mongoose.Types.ObjectId();
    const result = await Db.getById(userId, null);
    Assert.equal(result, null, 'Expects null response when no user is found');
  });

  it('getById with badly formatted userId', async () => {
    return Db.getById('this-is-a-bad-id', null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.idNotValid);
    });
  });

  it('getById without hash field', async () => {
    const search = {
      username: user.username
    };
    let found = await Db.search(search, null, null);
    Assert.isArray(found, 'Should be an array object');
    Assert.isAbove(found.length, 0, 'Should contain at least one object');
    found = found[0];

    const select = '-hash';
    const result = await Db.getById(found.id, select);
    Assert.isObject(result, 'Should return an object');
    Assert.isDefined(result.id, 'Should contain id property');
    Assert.isUndefined(result.hash, 'May not contain hash property');
  });

});