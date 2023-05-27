const { objectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis')
const sha1 = require('sha1'); // hash function
// const { v4: uuidv4 } = require('uuid'); // generate unique id

const UsersController = {
  async postNew(req, res) {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    const password = req.body.password
    if (!password) {
      return res.status(400).json({ error: 'Missing password' })
    }
    const existingEmail = await dbClient.usersCollection('users').findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = sha1(password);
    const user = await dbClient.usersCollection('users').insertOne({ email: email, password: hashedPassword });
    const userId = user.insertedId;
    return res.status(201).json({ id: userId, email: email });
  }
}

module.exports = UsersController;
