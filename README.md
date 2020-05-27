# swalbe-mongodb-node

This is a class library with basic CRUD functions for MongoDB with Mongoose. This is used to centralize basic validations to parameters and initialize a safe connection to MongoDB collection. This class library is intented for all Node.js projects of Swalbe/lej333. All functions will always return an object.

- Validates passed record id with Mongoose.Types.ObjectId.isValid function.
- Validates passed record when adding or updating record in MongoDB collection.
- Initializes a safe connection to MongoDB by checking if there is not a connection already opened. Mongoose will throw an error when an existing connection was still opened by concurrencing CRUD function.
