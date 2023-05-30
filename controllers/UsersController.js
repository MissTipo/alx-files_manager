const crypto = require('crypto');
// const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const UsersController = {
  async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    } else if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Finding user by email
      const user = await dbClient.getuser(email);
      // const existingUser = await usersCollection.findOne({ email: email });
      if (user) {
        // const user = redisClient.set(key)s
        // console.log(user)
        return res.status(400).json({ error: 'Already exists' });
      }

      // Creating a new user and hashing the password
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
      // const newUser = { email, hashedPassword };
      const userId = await dbClient.createUser(email, hashedPassword);


      // Return hashed user ID created and email
      return res.status(201).json({ id: userId, email });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getMe(req, res) {
    const token = req.headers['x-token'];
    // console.log({token})
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized no tokken found' });
    }

    try {
      const userId = await redisClient.get(`auth_${token}`);
      // console.log({userId})
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized'});
      }

      ///review this user id
      const user = await dbClient.getuserId(userId);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized No User found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error retrieving user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = UsersController;
