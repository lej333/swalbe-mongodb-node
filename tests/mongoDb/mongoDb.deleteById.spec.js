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

describe('lib/helpers/mongoDb.deleteById', () => {

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

  let userId = '';
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

  it('deleteById', async () => {
    const result = await Db.add(user, null);
    Assert.isDefined(result.id, 'Example user were not added!');

    userId = result.id;
    const deleted = await Db.deleteById(userId, null);
    Assert.isObject(deleted, 'Should return an object value');
    Assert.equal(deleted.username, user.username, 'Deleted user must have same username');
    Assert.equal(deleted.id, userId, 'Deleted user must have same id');

    const search = {
      username: user.username
    };
    const find = await Db.search(search, null, null);
    Assert.equal(find.length, 0, 'Expects nothing to be found');
  });

  it('deleteById without userId input', async () => {
    return Db.deleteById(null, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.idNotValid);
    });
  });

  it('deleteById with non-exists userId', async () => {
    const userId = Mongoose.Types.ObjectId();
    const result = await Db.deleteById(userId, null, Schema);
    Assert.isNull(result, 'Expects null response when no user is deleted');
    return true;
  });

  it('deleteById with badly formatted userId', async () => {
    return Db.deleteById('this-is-a-bad-id', null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.idNotValid);
    });
  });

  it('deleteById with select logic', async () => {
    const result = await Db.add(user, null, Schema);
    Assert.isDefined(result.id, 'Example user were not added!');
    const userId = result.id;

    const select = '-hash';
    const deleted = await Db.deleteById(userId, select, Schema);
    Assert.isObject(deleted, 'Delete object should not be empty');
    Assert.equal(deleted.username, user.username, 'Deleted user must have same username');
    Assert.equal(deleted.id, userId, 'Deleted user must have same id');
    Assert.isUndefined(deleted.hash, 'May not return hash');
    return true;
  });

});