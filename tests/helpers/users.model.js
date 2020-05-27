const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  namePrefix: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  creationUserId: {
    type: String,
    default: ''
  },
  modifiedDate: {
    type: Date,
    default: null
  },
  modifiedUserId: {
    type: String,
    default: null
  }
});

schema.set('toJSON', {
  virtuals: true
});

module.exports = Mongoose.model('users', schema);