const Boom = require('@hapi/boom');
const Chai = require('chai');
const Assert = Chai.assert;

const error = (err, expectedMessage) => {
  Assert.isTrue(Boom.isBoom(err), 'Expects a Boom error');
  Assert.equal(err.message, expectedMessage, 'Expects a correct error message');
  return true;
}

module.exports = error;