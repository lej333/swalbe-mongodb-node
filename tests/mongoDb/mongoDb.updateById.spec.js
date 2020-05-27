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

describe('lib/helpers/mongoDb.updateById', () => {

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
    hash: 'hashed string'
  }
  let userId = '';

  before(async () => {
    await CleanTests.cleanUser(user.username);
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  it('update', async () => {
    const result = await Db.add(user, null);
    Assert.isObject(result, 'Should not be an empty object');
    Assert.isDefined(result.id, 'Should contain id property');
    userId = result.id;

    user.hash = 'updated hash';
    const updated = await Db.updateById(result.id, user, null);
    Assert.isObject(updated, 'Should return an object');
    Assert.equal(updated.username, user.username, 'Updated user must have same username');
    Assert.equal(updated.hash, 'updated hash', 'The updated hash must same as update');
    Assert.equal(updated.id, result.id, 'Updated user must have same id');
  });

  it('update without userId input', async () => {
    return Db.updateById(null, user, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.idNotValid);
    });
  });

  it('update with badly formatted userId', async () => {
    return Db.updateById('this-is-a-bad-id', user, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.idNotValid);
    });
  });

  it('update without update input', async () => {
    return Db.updateById(userId, null, null).then(() => {
      throw 'We expected an error!';
    }).catch((err) => {
      ErrorTests(err, Messages.missingRecord);
    });
  });

  it('update with non-exists userId', async () => {
    const result = await Db.updateById(Mongoose.Types.ObjectId(), user, null);
    Assert.isNull(result, 'Expects null response when no user is updated');
  });

  it('update with wrong field', async () => {
    user.withWrongField = 'very-wrong';
    const updated = await Db.updateById(userId, user, null);
    Assert.isObject(updated, 'Should return an object');
    Assert.isUndefined(updated.withWrongField, 'Wrong property may not be defined');
    delete user.withWrongField;
  });

});