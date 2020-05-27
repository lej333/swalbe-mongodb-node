/*
* Central util helper class.
* Contains functions to help us with some string manipulations, validations or something in that way.
* For centralizing code and prevent code mess.
* */
const Mongoose = require('mongoose');
const Boom = require('@hapi/boom');
const Messages = require('./messages');

/*
* Validates the id passed in MongoDb class functions before proceed to database to prevent Mongoose errors due invalid id.
* And throws own custom Boom error when not valid.
* So undefined/null and badly formatted id will return same error message.
*/
const validateId = (id) => {
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    throw Boom.badData(Messages.idNotValid);
  }
}

module.exports = {
  validateId
};