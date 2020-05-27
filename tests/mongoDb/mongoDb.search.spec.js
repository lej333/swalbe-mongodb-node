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

describe('lib/helpers/mongoDb.search', () => {

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

  before(async () => {
    await CleanTests.cleanUser(user.username);
  });

  after(async () => {
    await CleanTests.cleanUser(user.username);
  });

  it('search', async () => {
    const result = await Db.add(user, null, Schema);
    Assert.isObject(result, 'Should return an object');
    Assert.isDefined(result.id, 'Should contain id property');

    const search = {
      username: user.username
    };

    const users = await Db.search(search, null, null);
    Assert.isArray(users, 'Should return an array object');
    Assert.equal(users.length, 1, 'Array object should contain one user object');
    Assert.equal(users[0].username, user.username, 'Found user must have same username');
  });

  it('search with no results', async () => {
    const search = {
      username: 'non-existsing-user'
    };
    const users = await Db.search(search, null, null);
    Assert.isArray(users, 'Should return an array object');
    Assert.equal(users.length, 0, 'Should be an empty array');
  });

  it('search with wrong field name', async () => {
    const search = {
      notAnUserField: 'search'
    };
    const users = await Db.search(search, null, null);
    Assert.isArray(users, 'Should return an array object');
    Assert.equal(users.length, 0, 'Should be an empty array');
  });

});