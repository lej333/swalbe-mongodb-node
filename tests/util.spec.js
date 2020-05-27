/**
 * This test tests the util helper class which contains useful functions for MongoDb
 */
process.env.NODE_ENV = 'test';

const Util = require('../src/util');
const Chai = require('chai');
const Assert = Chai.assert;
const _ = require('lodash');
const Mongoose = require('mongoose');
const ErrorTests = require('./helpers/errorTests');
const Messages = require('../src/messages');

describe('util', () => {

  it('validateId', () => {
    try {
      const id = Mongoose.Types.ObjectId();
      Util.validateId(id);
    } catch(ex) {
      Assert.isFalse(true, 'Did\'t expected an error');
    }
  });

  it('validateId (null)', () => {
    try {
      Util.validateId(null);
    } catch(err) {
      ErrorTests(err, Messages.idNotValid);
    }
  });

  it('validateId (undefined)', () => {
    try {
      Util.validateId(undefined);
    } catch(err) {
      ErrorTests(err, Messages.idNotValid);
    }
  });

  it('validateId (no param)', () => {
    try {
      Util.validateId();
    } catch(err) {
      ErrorTests(err, Messages.idNotValid);
    }
  });

  it('validateId (badly formatted id)', () => {
    try {
      Util.validateId('this-is-a-badly-formatted-id');
    } catch(err) {
      ErrorTests(err, Messages.idNotValid);
    }
  });

});